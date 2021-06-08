const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../../db/schema/User");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

router.post("/", async (req, res) => {
    var check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ error: "User is already exist" });
    }
    var pass = await bcrypt.hash(req.body.password, saltRounds);
    var doc = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: pass
    });

    var token = jwt.sign({
        data: doc._id
    }, process.env.SECRET, { expiresIn: '1h' });
    if(!token){
        return res.status(400).json({error:"Token is invalid"});
    }
    res.cookie('token', token).json({ success: true, token: token });

})

module.exports = router;