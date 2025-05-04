const mongoose = require('mongoose');

const exitRequestSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['tea','hod', 'Approved', 'Rejected','Expired'],
        default: 'tea'
    },
    time:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    
});

const ExitRequest = mongoose.model('ExitRequest', exitRequestSchema);

module.exports = ExitRequest;
