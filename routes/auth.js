const { login, register, verifyUserSignup } = require("../controllers/auth");
const {
  validateLoginRequest,
  validateRegisterRequest,
  validateActivateAccount,
} = require("../middleware/validations/auth");

const route = require("express").Router();

route.post("/login", validateLoginRequest, login);
route.post("/register", validateRegisterRequest, register);
route.post("/activate-account", validateActivateAccount, verifyUserSignup);

module.exports = route;
