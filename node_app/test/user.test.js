const login = require("../controller/login");
const logout = require("../controller/logout");
const register = require("../controller/register");
const req = require("supertest");
const express = require("express");
const {connectdb,disconnectdb} = require("../../db/connect");

const prepare = (component) => req(express().use(express.json()).use(component));

beforeAll(async() => {
    await connectdb();
})

afterAll(async() => {
    await disconnectdb();
})

let token;
describe("/auth/register", ()=> {
    it("basic case", async () => {
        var res = await prepare(register).post("/").send({
            "name": "TEST_USER",
            "email": "test@hotmail.com",
            "password": "test1234"
          });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

describe("/auth/login", () => {
    it("basic case", async() => {
        var res = await prepare(login).post("/").send({
        "email": "test@hotmail.com",
        "password": "test1234"});
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        token = res.body.token;
    });
});

describe("/auth/logout", () => {
    it("basic case", async() => {
        var res = await prepare(logout).post("/").set('Authorization','Bearer '+token);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe("Logout Successfully");
        expect(res.body.data.name).toBe("TEST_USER");
    });
});