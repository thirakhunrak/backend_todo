const User = require("../db/schema/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({ error: "Unauthorize", data: {} });
    }
    var decoded = jwt.verify(req.cookies.token, process.env.SECRET);
    var user = await User.findById(decoded.data);
    req.user = user;
    next();
}

