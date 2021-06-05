const { login, register } = require("../controllers/auth");
const {
  validateLoginRequest,
  validateRegisterRequest,
} = require("../middleware/validations/auth");

const route = require("express").Router();

route.post("/login", validateLoginRequest, login);
route.post("/register", validateRegisterRequest, register);

module.exports = route;
