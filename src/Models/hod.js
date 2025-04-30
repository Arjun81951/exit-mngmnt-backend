const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Hod = mongoose.model('Hod', hodSchema);

module.exports = Hod;
