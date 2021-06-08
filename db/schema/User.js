const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
        name: {
            type: String,
            require: [true, 'Plase add a name']
        },
		email: {
            type: String,
            validate: {
                validator: (val) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
                message: (props) => `${props.value} validation error`,
              },
        },
        password: {
            type: String,
            require: [true, 'Plase add a password'],
            slecet:false
        },
        createAt: {type:Date,default: new Date()}
	},
	{ collection: "user" }
);

module.exports = mongoose.model("user", UserSchema);