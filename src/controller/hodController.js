const express = require('express');
const Notice = require('../models/notice'); // Assuming you have a Notice model
const Message = require('../Models/message'); // Assuming you have a Message model

// Create a new notice
exports.createNotice = async (req, res) => {
    try {

        const { title, description,department } = req.body;

        // Create a new notice instance
        const newNotice = new Notice({
            title,
            description,
            createdBy: 'HOD',
            department: department// Assuming HOD is creating the notice
        });

        // Save the notice to the database
        await newNotice.save();

        res.status(201).json({ message: 'Notice created successfully', notice: newNotice });
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice', error });
    }
};

// View notices by department
exports.viewNoticesByDepartment = async (req, res) => {
    try {
        console.log("View Notices by Department");
        
        const {dep} = req.params;
        console.log("dep",dep);

        // Find notices by department
        const notices = await Notice.find({department:dep});
        console.log("notices",notices);

        if (notices.length === 0) {
            return res.status(404).json({ message: 'No notices found for this department' });
        }
        console.log("notices",notices);
        
        res.status(200).json({ notices });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notices', error });
    }
};

// View all notices
exports.viewAllNotices = async (req, res) => {
    try {
        // Find all notices
        const notices = await Notice.find();

        res.status(200).json({ notices });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notices', error });
    }
};

// Send a message to a student
exports.sendMessageToStudent = async (req, res) => {
    try {
        const { email, content } = req.body;

        // Create a new message instance
        const newMessage = new Message({
            email,
            content,
            sentBy: 'HOD',
            sentAt: new Date()
        });

        // Save the message to the database
        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully', messageDetails: newMessage });
    } catch (error) {
        console.log("error",error);
        
        res.status(500).json({ message: 'Error sending message', error });
    }
};

// Get messages with the latest message first
exports.getMessages = async (req, res) => {
    const {email} = req.params
    try {
        // Retrieve messages sorted by sentAt in descending order
        const messages = await Message.find({email:email}).sort({ sentAt: -1 });

        res.status(200).json({ messages });
    } catch (error) {
        console.log("errorrrrrrrrrrrrrr",error);
        
        res.status(500).json({ message: 'Error retrieving messages', error });
    }

};




