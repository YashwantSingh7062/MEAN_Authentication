const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"./uploads");
    },
    filename : (req,file,cb) => {
        cb(null,Date.now() + file.originalname.replace(/ /g,"_"));
    }
})
const fileFilter = (req,file,cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null , true);
    }
    else{
        cb(null , false);
    }
}
const uploads = multer({
    storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter
});

const User = require('../models/user');

router.post("/login",(req,res) => {
    User.findOne({email : req.body.email})
        .then(result => {
            if(result){
                bcrypt.compare(req.body.password,result.password,(err,hashResult) => {
                    if(err){
                        res.status(401).json({
                            message : "Auth Failed"
                        })
                    }
                    else if(hashResult){
                        let token = jwt.sign({_id : result._id , email : result.email},process.env.SECRET_KEY,{expiresIn : "1h"});
                        res.status(200).json({
                            message : "Auth Successful",
                            token
                        })
                    }
                    else{
                        res.status(401).json({
                            message : "Auth Failed"
                        })
                    }
                })
            }
            else{
                res.status(401).json({
                    message : "Auth Failed"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                error
            })
        })
})

router.post("/signup",uploads.single('userImage'),(req,res) => {
    User.findOne({email : req.body.email})
        .then(result => {
            if(!result){
                bcrypt.hash(req.body.password,10,(err , hash) => {
                    if(err){
                        res.status(500).json({
                            message : "Something went wrong"
                        })
                    }else{
                        let newUser = new User({
                            email : req.body.email,
                            password : hash,
                            userImage : req.file.path
                        })
                        newUser.save()
                                .then(() => {
                                    res.status(200).json({
                                        message : "User Registered"
                                    })
                                })
                                .catch(err => console.log(err));
                    }
                })
            }
            else{
                res.status(409).json({
                    message : "Email Already Exist"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        })
})

module.exports = router;