const db = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectdb = () => db.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true },(err) =>{
    if (err)
        console.error(err);
    else
        console.log("Connected to the mongodb");
});

const disconnectdb = async () => {
    try {
		await db.disconnect();
	} catch (err) {
		throw new Error(err);
	}
}

module.exports = {connectdb,disconnectdb};


