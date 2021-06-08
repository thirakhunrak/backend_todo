const express = require("express");
const {connectdb,disconnectdb} = require("./db/connect");
const httpShutdown = require("http-shutdown");
const path = require("path");
const dotenv = require("dotenv");
const register = require("./node_app/controller/register");
const login = require("./node_app/controller/login");
const logout = require("./node_app/controller/logout");
const tokenhandle = require("./middleware/tokenhandle");
const todo = require("./node_app/controller/todo");
const morgan = require('morgan')

const cookieParser = require("cookie-parser");

const main = async () =>{
    dotenv.config({ path: path.join(__dirname, ".env") });
	dotenv.config({ path: path.join(__dirname, ".env.default") });

    await connectdb();

    var app = express();
    app.use(morgan("tiny"))
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }))

    app.use("/app/auth/register",register);
    app.use("/app/auth/login",login);
    app.use("/app/auth/logout",logout);
    app.use("/app/auth/",cookieParser(),tokenhandle,todo);

    app.use((req, res) => {
        res.status(404).send("404 Not found")
    });

    app.use((err,req, res, next) => {
        res.status(500).json({err:err.message});
    })

    var server = httpShutdown(app.listen(process.env.port));
    
    var called = false;
	const shutdown = () => {
		if (called) return;
		called = true;
		console.log("shutdown");
		server.shutdown(async (err) => {
			try {
				await disconnectdb();
				console.log("disconnect");
				return process.exit(0);
			} catch (e) {
				err = e;
			}
			console.error(err);
			return process.exit(1);
		});
	};

    process.once("SIGINT", shutdown).once("SIGTERM", shutdown);
}

main();