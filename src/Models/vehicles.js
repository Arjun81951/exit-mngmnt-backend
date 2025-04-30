const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
    },
    entryTime: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
