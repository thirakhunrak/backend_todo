const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const Todo = require("../../db/schema/Todo");
var bodyParser = require('body-parser');


const isValidTitle = (title) => {
    if (typeof title == "string") {
        return true;
    } return false;
}

router.get("/todos", async (req, res) => {
    var ans = await Todo.find();
    var count = ans.length;
    res.json({ succes: true, count: count, data: ans });
})

router.post("/todos", async (req, res) => {
    var ans = {};
    if (!isValidTitle(req.body.title)) {
        res.status(400).json({ error: "Todo validation failed: title: Please add a title", data: ans });
    } else {
        var doc = await Todo.create(req.body);
        //ans = await Todo.insertMany(req.body);
        res.json({ success: true, data: doc });
    }
})

router.get("/todos/:_id", async (req, res) => {
    if (!isValidObjectId(req.params._id)) {
        res.status(400).json({ error: "Mongo Cast Error (Invalid ObjectID)", data: {} });
    } else {
        var ans = await Todo.findOne(req.params);
        if (!ans) {
            res.status(400).json({ error: "Todo not found", data: {} });
        } else {
            res.status(200).json({ success: true, data: ans });
        }
    }

})

router.put("/todos/:_id", async (req, res) => {
    if (!isValidObjectId(req.params._id)) {
        res.status(400).json({ error: "Mongo Cast Error (Invalid ObjectID)", data: {} });
    }
    else if (!isValidTitle(req.body.title)) {
        res.status(400).json({ error: "Invalid Title", data: {} });
    }
    else {
        var ans = await Todo.findByIdAndUpdate(req.params._id, req.body, { new: true });
        if (!ans) {
            res.status(400).json({ error: "Todo not found", data: {} });
        } else {
            res.json({ success: true, data: ans });
        }
    }
})

router.delete("/todos/:_id", async (req, res) => {
    if (!isValidObjectId(req.params._id)) {
        res.status(400).json({ error: "Mongo Cast Error (Invalid ObjectID)", data: {} });
    } else {
        var ans = await Todo.findByIdAndDelete(req.params);
        if (!ans) {
            res.status(400).json({ error: "Todo not found", data: {} });
        } else {
            res.json({ success: true, data: ans });
        }
    }
})
module.exports = router;