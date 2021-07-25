const {
  login,
  register,
  verifyUserSignup,
  requestForgotPassword,
  resetForgotPassword,
  passportLocalLogin,
} = require("../controllers/auth");
const {
  getValidUser,
  renderLoginGithubPage,
  githubAuthRedirect,
} = require("../middleware/auth");
const {
  validateLoginRequest,
  validateRegisterRequest,
  validateResetPassword,
  validateForgotRequest,
} = require("../middleware/validations/auth");

const route = require("express").Router();
route.post(
  "/sign_in",
  [validateLoginRequest, getValidUser],
  passportLocalLogin
);

route.post("/login", [validateLoginRequest, getValidUser], login);
route.post("/register", validateRegisterRequest, register);
route.get("/github_login", renderLoginGithubPage);
route.get("/oauth/redirect", githubAuthRedirect);
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
