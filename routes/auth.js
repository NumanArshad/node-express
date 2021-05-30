const { login, register } = require("../controllers/auth");

const route = require("express").Router();

route.post("/login", login);
route.post("/register", register);

module.exports = route;
