const User = require("../db/schema/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    let token;

    let authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(" ")[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    if(!token){
        return res.status(401).json({ error: "Unauthorize", data: {} });
    }
    var decoded = await jwt.verify(token, process.env.SECRET);
    var user = await User.findById(decoded.data);
    req.user = user;
    next();
}

