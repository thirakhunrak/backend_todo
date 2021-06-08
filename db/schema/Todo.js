const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const todoSchema = new Schema(
    {
        order: { type: Number, default: 1 },
        createdAt: { type: Date, default: new Date() },
        title: { type: String, require: true }
    },
    { collection: "todo" } //ชื่อ collection ใน DB
);

todoSchema.pre('save', async function (next) {
    var maxTodo = await TodoModel.countDocuments();
    if (!maxTodo) next();

    maxTodo = await TodoModel.find().sort('-order').limit(1);
    this.order = maxTodo.order + 1;

    next();

})



var TodoModel = mongoose.model("todo", todoSchema); //ชื่อ model ใน code
module.exports = TodoModel;