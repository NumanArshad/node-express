const { getAllUsers, getUserById } = require("../controllers/users");

const route = require("express").Router();

route.get("/", getAllUsers);
route.get("/:id", getUserById);

module.exports = route;
