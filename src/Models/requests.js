const mongoose = require('mongoose');

const exitRequestSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
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
        enum: ['Pending', 'Approved', 'Rejected','Expired'],
        default: 'Pending'
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
