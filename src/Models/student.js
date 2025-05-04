const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    admission_no: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['accepted','rejected','pending'], default: 'pending' },
    department: { type: String, required: true, enum: ['CS', 'EC', 'ME', 'CE'] },
    className: { type: String, required: true },    
    password: { type: String, required: true },
    exit_request:{type:String},
    fees:{type:String},
    feeStat:{type:String}
});

module.exports = mongoose.model('Student', studentSchema);
