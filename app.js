const express = require("express");
const connectdb = require("./db/connect");
const register = require("./node_app/controller/register");
const login = require("./node_app/controller/login");
const logout = require("./node_app/controller/logout");
const tokenhandle = require("./middleware/tokenhandle");
const todo = require("./node_app/controller/todo");

const cookieParser = require("cookie-parser");

const main = async () =>{
    await connectdb();
    var app = express();
    app.use(express.json());
    app.use("/app/auth/register",register);
    app.use("/app/auth/login",login);
    app.use("/app/auth/logout",logout);
    app.use("/app/auth/",cookieParser(),tokenhandle,todo);
    app.listen(3000);
}

main();