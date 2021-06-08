const express = require("express");
const User = require("../../db/schema/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser =require('cookie-parser');
const tokenhandler = require("../../middleware/tokenhandle");
var bodyParser = require('body-parser');

router.use(cookieParser()).use(express.json()).use(bodyParser.json());

router.post("/",tokenhandler, async (req, res) =>{
    var user = req.user;
    if(!user){
        return res.status(401).json({error:"User not found", data:{}});
    }
    res.clearCookie("token");
    res.status(200).json({success:"Logout Successfully", data: user});
    
})

module.exports = router;