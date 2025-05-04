const express = require('express');
const Teacher = require('../Models/teacher');

exports.createTeacher = async (req,res)=>{
    const {name,department,email,password} =req.body;
    try{

        const existingTeacher = await Teacher.findOne({email});
        if(existingTeacher){
            return res.status(400).send("teacher already exists")
        }
        const teacher =new Teacher({ email, name, department, password });
        await teacher.save();
        res.json({ success: true, teacher });


     }catch(error){
        console.log("error add teacher",error);
        res.status(500).send("internal server error")
        
    }
}
