const {
  login,
  register,
  verifyUserSignup,
  requestForgotPassword,
  resetForgotPassword,
} = require("../controllers/auth");
const { getValidUser } = require("../middleware/auth");
const {
  validateLoginRequest,
  validateRegisterRequest,
  validateResetPassword,
  validateForgotRequest,
} = require("../middleware/validations/auth");

const route = require("express").Router();

route.post("/login", [validateLoginRequest, getValidUser], login);
route.post("/register", validateRegisterRequest, register);
route.post(
  "/activate-account",
  [validateResetPassword, getValidUser],
  verifyUserSignup
);
route.post(
  "/request-forgot-password",
  [validateForgotRequest, getValidUser],
  // validateActivateAccount,
  requestForgotPassword
);

route.post(
  "/reset-password",
  [validateResetPassword, getValidUser],
  resetForgotPassword
);

module.exports = route;
