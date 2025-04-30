const express = require('express');
const {registerStudent, hodAcceptOrRejectStudent, Login, viewStudent, getRequestById} = require('../controller/studentController');
const { viewNoticesByDepartment,createNotice,viewAllNotices,getMessages,sendMessageToStudent } = require( '../controller/hodController');
const {acceptRegisteredStudents} = require('../controller/studentController')
const {addNewHOD} = require('../controller/studentController');
const {addNewSecurity} = require('../controller/studentController');
const {requestExitFromCollege,updateExitRequest} = require('../controller/studentController');
const{listUnapprovedStudents,listAcceptedStudents,updateFees,getExitRequestsByDepartment,handleExitRequest,viewMostRecentExitRequestByStudent} = require('../controller/studentController');
const{enterVehicleDetails,getLatestVehicles} = require('../controller/securityController')

const router = express.Router();

// router.post('/generate', generateQRCode);
router.post('/student/add',registerStudent)
router.post('/login', Login);
router.post('/student/request', (req, res)=> requestExitFromCollege(req,res));

//HOD Router
router.post('/hod/add', addNewHOD);
router.post('/hod/notice', createNotice);
router.post('/student/accept', hodAcceptOrRejectStudent);
router.get('/student/accept/:dep',(req,res)=> listAcceptedStudents(req,res));
router.get('/student/unapprovedlist/:dep', (req, res)=> listUnapprovedStudents(req,res));
router.get('/student/accept',(req,res)=> acceptRegisteredStudents(req,res));
router.get('/student/requests/:dep', (req,res)=> getExitRequestsByDepartment(req,res));
router.post('/request/accept', handleExitRequest);
router.get('/student/request/:email', (req,res)=> viewMostRecentExitRequestByStudent(req,res));
router.post('/security/request',updateExitRequest);
router.post('/message/sent',sendMessageToStudent)
router.get('/message/:email',getMessages)
router.post('/student/fee',updateFees)
router.get('/student/view/:email', (req,res)=>viewStudent(req,res));



//Notice Routes
router.post('/hod/notice', (req,res)=> createNotice(req,res));
router.get('/hod/notice/:dep',(req,res)=> viewNoticesByDepartment(req,res));
router.get('/hod/notices', (req,res)=> viewAllNotices(req,res));

// router.post('/student/accept', acceptRegisteredStudents);

//security routes
router.post('/security/add', addNewSecurity);
router.post('/vehicle/add',enterVehicleDetails);
router.get('/vechicle',getLatestVehicles)
router.get('/request/:id',(req,res)=>getRequestById(req,res))





//Security Router



module.exports = router;
