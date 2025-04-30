const Student = require('../models/Student');
const QRCode = require('qrcode');
const HOD = require('../Models/hod'); // Assuming there is a HOD model
const Security = require('../Models/security'); // Assuming there is a Security model
const ExitRequest = require('../Models/requests')
const jwt = require('jsonwebtoken'); // Add JWT library

// Add Student by HOD
exports.registerStudent = async (req, res) => {
    try {
        const { email,admission_no,name,department,className,password} = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ admission_no});
        if (existingStudent) {
            return res.status(400).json({ error: 'Student already exists' });
        }
        // Create new student
        const student = new Student({ email, name, admission_no,department,className,password });
        await student.save();

        res.json({ success: true, student });
    } catch (error) {
        console.log("errrrr",error);
        
        res.status(500).json({ error: 'Server Error' });
    }
};
// HOD Accept or Reject Student
exports.hodAcceptOrRejectStudent = async (req, res) => {
    try {
        const { email, action } = req.body;

        // Find student by ID
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Accept or reject student
        if (action === 'accept') {
            student.status = 'accepted';
        } else if (action === 'reject') {
            student.status = 'rejected';
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        await student.save();

        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// API to accept registered students
exports.acceptRegisteredStudents = async (req, res) => {
    try {
        const { email } = req.body;

        // Find student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Accept the student
        student.status = 'accepted';
        await student.save();

        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Student, HOD, and Security Login
exports.Login = async (req, res) => {
    console.log("called");
    
    try {
        const { email, password } = req.body;

        // Check if user is a student
        let user = await Student.findOne({ email });
        console.log(user,"user");
        
        if (user) {
            if (user.status !== 'accepted') {
                return res.status(403).json({ error: 'Student not approved by HOD' });
            }
            if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({ email: user.email, role: 'student', department: user.department }, 'your_jwt_secret', { expiresIn: '1h' });
            console.log("token",token); 
            
            return res.status(200).json({ success: true, user, role: 'student', token });
        }

        // Check if user is a HOD
        user = await HOD.findOne({ email });
        if (user) {
            if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({ email: user.email, role: 'hod', department: user.department }, 'your_jwt_secret', { expiresIn: '1h' });
            console.log("token",token);
            
            return res.status(200).json({ success: true, user, role: 'hod', token });
        }

        // Check if user is a security personnel
        user = await Security.findOne({ email });
        if (user) {
            if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({ email: user.email, role: 'security', department: user.department }, 'your_jwt_secret', { expiresIn: '1h' });
            return res.status(200).json({ success: true, user, role: 'sec', token });
        }

        return res.status(404).json({ error: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// List All Unapproved Students by HOD
exports.listUnapprovedStudents = async (req, res) => {
    try {
        const { dep } = req.params;
        console.log("dep",dep);
        
        // Find all students with status not 'accepted' and matching HOD's department
        const students = await Student.find({ status: { $ne: 'accepted' }, department: dep });

        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// List All Accepted Students
exports.listAcceptedStudents = async (req, res) => {
    try {

        const { dep } = req.params;
        console.log("dep",dep);
        // Find all students with status 'accepted'
        const students = await Student.find({ status: 'accepted', department: dep });

        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Request Exit from College
exports.requestExitFromCollege = async (req, res) => {
    try {
        const { email, reason, time} = req.body;

        // Find student by ID
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log("student",student.id);
        
        // Create exit request
        const exitRequest = new ExitRequest({
            name:student.name,
            student_id: student.id,
            email:email,
            department: student.department,
            reason: reason,
            time: time,
            exit_status: 'pending'
        });
        await exitRequest.save();
        console.log("exitRequest",exitRequest);
        

        

        res.status(200).json({ success: true, student, exitRequest });
    } catch (error) {
        console.log("errrrrrrrrrrrrr", error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get All Exit Requests Department Wise    
exports.getExitRequestsByDepartment = async (req, res) => {
    try {
        console.log("getExitRequestsByDepartment");
        
        const {dep} = req.params
        console.log("department",dep);
        
        // Find all students with exit requests
        const requests = await ExitRequest.find({ status:'Pending',department:dep });

        console.log("students",requests);
        // Group by department
        // const requestsByDepartment = students.reduce((acc, student) => {
        //     const { department, exit_request } = student;
        //     if (!acc[department]) {
        //         acc[department] = [];
        //     }
        //     acc[department].push({
        //         email: student.email,
        //         name: student.name,
        //         reason: exit_request.reason,
        //         exit_time: exit_request.exit_time
        //     });
        //     return acc;
        // }, {});

        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.log("error",error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Accept, Reject, or Schedule Meeting for Exit Requests by HOD
exports.handleExitRequest = async (req, res) => {
    try {
        const {  action, id} = req.body;

        // Find student by ID
        const request = await ExitRequest.findById(id);

        // Handle the exit request based on action
        if (action === 'Approve') {
            request.status = 'Approved';
        } else if (action === 'Reject') {
            request.status = 'Rejected';
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        await request.save();

        console.log("APROVED",request);
        
        res.json({ success: true, request });
    } catch (error) {
        console.log("error",error); 
        
        res.status(500).json({ error: 'Server Error' });
    }
};
// Add New HOD
exports.addNewHOD = async (req, res) => {
    try {
        const { email, name, department, password } = req.body;

        // Check if HOD already exists
        const existingHOD = await HOD.findOne({ email });
        if (existingHOD) {
            return res.status(400).json({ error: 'HOD already exists' });
        }

        // Create new HOD
        const hod = new HOD({ email, name, department, password });
        await hod.save();

        res.json({ success: true, hod });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Add New Security
exports.addNewSecurity = async (req, res) => {
    try {
        const { email,name,password } = req.body;

        // Check if Security already exists
        const existingSecurity = await Security.findOne({ email });
        if (existingSecurity) {
            return res.status(400).json({ error: 'Security already exists' });
        }

        // Create new Security
        const security = new Security({ email, name,  password });
        await security.save();

        res.json({ success: true, security });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Server Error' });
    }
};

// View Most Recently Created Exit Request by Student
exports.viewMostRecentExitRequestByStudent = async (req, res) => {
    try {
        const { email } = req.params;

        // Find the most recently created exit request by the student
        const recentRequest = await ExitRequest.findOne({ email }).sort({ createdAt: -1 });

        if (!recentRequest) {
            return res.status(404).json({ error: 'No exit requests found for this student' });
        }

        res.json({ success: true, recentRequest });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Update an Exit Request
exports.updateExitRequest = async (req, res) => {
    
    try {
        const {status,_id} = req.body;

        // Find the exit request by ID
        const exitRequest = await ExitRequest.findOne({_id});
        if (!exitRequest) {
            return res.status(404).json({ error: 'Exit request not found' });
        }

        // Update the fields

        if (status) exitRequest.status = status;

        await exitRequest.save();

        

        res.json({ success: true, exitRequest });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.updateFees = async(req,res)=>{
    const {email,fees} = req.body;
    try {
        const student  = await Student.findOne({email})
        if(student) student.fees =fees;

        await student.save()

        res.json({ success: true, student });

    }catch(error){
        console.log("error",error);
        res.status(500).send(error)
        
    }
} 
exports.viewStudent = async(req,res)=>{
     const {email} = req.params;
     console.log("email",email);
     
     try{
        const student =await Student.findOne({email})
        console.log("stud",student);
        
        if(student){
            res.status(200).send(student)
            
        }

     }catch(error){
        res.status(500).send("internal server error")
     }
}
exports.getRequestById=async(req,res)=>{
    try {
        const {id}=req.params
        const request=await ExitRequest.findById(id)
        if(!request){
            return res.status(404).json({error:'exit request not found'})

        }
        res.json({
            success:true,request
        })
    }catch(error){res.status(500).json ({error:'server eror'})
}
}