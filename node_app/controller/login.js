const express = require("express");
const User = require("../../db/schema/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/", async (req, res) =>{
    if(!req.body.email||!req.body.password){
        return res.status(400).json({error: "Empty email or password", data:{}});
    }
    var pass = await User.findOne({email:req.body.email}).select('password');
    if(!pass){
        return res.status(400).json({error:"Email is invalid"});
    }
    var match = await bcrypt.compare(req.body.password, pass.password);
    if(!match){
        return res.status(400).json({error:"Password is invalid"});
    }
    var token = jwt.sign({
        data: pass._id
    }, process.env.SECRET, { expiresIn: '1h' });
    if(!token){
        return res.status(400).jason({error:"Token is invalid"});
    }
    res.setHeader('authorization',`Bearer ${token}`);
    res.status(200).cookie('token',token).json({success:true,token:token});
})

module.exports = router;