const { getAllUsers } = require("../controllers/users");

const route = require("express").Router();

route.get("/", getAllUsers);

module.exports = route;
