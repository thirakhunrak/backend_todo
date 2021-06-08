const todo = require("../controller/todo");
const req = require("supertest");
const express = require("express");
const {connectdb,disconnectdb} = require("../../db/connect");

const prepare = () => req(express().use(express.json()).use(todo));

beforeAll(async() => {
    await connectdb();
})

afterAll(async() => {
    await disconnectdb();
})

let testId;

describe("/auth/todos", () => {
    describe("POST /auth/todos", () => {
        it("basic case", async () => {
            var res = await prepare().post("/todos").send({title:"Day 1 work"});
            testId = res.body.data._id;
            expect(res.status).toBe(200);
        });
        it("400 Invalid title", async () => {
            var res = await prepare().post("/todos").send({});
            expect(res.status).toBe(400);
            expect(res.body).toEqual({error: "Todo validation failed: title: Please add a title", data: {} });
        });
    });
    describe("GET /auth/todos/{_id}", () => {
        it("basic case", async () => {
            var res = await prepare().get('/todos/'+testId);
            expect(res.status).toBe(200);
        });
        it("400 Mongo Cast Error", async() => {
            var res = await prepare().get("/todos/60bca4f237");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Mongo Cast Error (Invalid ObjectID)", data: {} });
        });
        it("400 Todo not found", async () => {
            var res = await prepare().get("/todos/60a4d13c33566fe49db63dba");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Todo not found", data: {} });
        });
    });
    describe("PUT /auth/todos/{_id}", () => {
        it("basic case", async () => {
            var res = await prepare().put("/todos/"+testId).send({title: "Day 10 work!"});
            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe("Day 10 work!");
        });
        it("400 Mongo cast Error", async () => {
            var res = await prepare().put("/todos/60bca4f237").send({title:"Day 10 work!"});
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Mongo Cast Error (Invalid ObjectID)", data: {} });
        });
        it("400 Todo not found", async () => {
            var res = await prepare().put("/todos/60a4d13c33566fe49db63dba").send({title:"Day 10 work!"});
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Todo not found", data: {} });
        });
        it("400 Invalid Title", async () => {
            var res = await prepare().put("/todos/"+testId).send({title: 123});
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Invalid Title", data: {} });
        });
    });
    describe("DELETE /auth/todos/{_id}", () => {
        it("basic case", async () => {
            var res = await prepare().delete("/todos/"+testId);
            expect(res.status).toBe(200);
        });
        it("400 Mongo cast Error", async () => {
            var res = await prepare().delete("/todos/60bca4f237");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Mongo Cast Error (Invalid ObjectID)", data: {} });
        });
        it("400 Todo not found", async () => {
            var res = await prepare().delete("/todos/60a4d13c33566fe49db63dba");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Todo not found", data: {} });
        });
    });
});
