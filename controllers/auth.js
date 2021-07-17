const brcypt = require("bcrypt");
const crypto = require("crypto");
const passport = require("passport");
const {
  UNAUTHORIZE,
  NOT_FOUND,
  UNPROCESSIBLE_ENTITY,
  INTERNAL_SERVER_ERROR,
} = require("../config/httpStatusCode");
const db = require("../db/index");
const { generateToken } = require("../middleware/auth");
const {
  CustomError,
  CustomPropertyError,
} = require("../middleware/errorHandler");
const sendEmail = require("../utils/emails");
const { getUserByIdorEmail } = require("./users");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = req.user;

    const isMatch = await brcypt.compare(password, user.password);
    if (!isMatch) throw new CustomError("invalid credential", UNAUTHORIZE);

    const { password: pswrd, ...restUserInfo } = user;

    const token = generateToken(restUserInfo);
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, username } = req.body;

  try {
    const user = await getUserByIdorEmail({ email });
    if (user) {
      throw new CustomPropertyError(
        "email exist already",
        "email",
        UNPROCESSIBLE_ENTITY
      );
    }

    await db.query("BEGIN");

    const response = await db.query(
      "insert into users (username, email) values ($1, $2) RETURNING *",
      [username, email]
    );
    if (response.rowCount) {
      const userResponse = response.rows[0];

      ////generate random string token for reset password tokens
      const requestSignupToken = crypto.randomBytes(10).toString("hex");
      const hashToken = await brcypt.hash(requestSignupToken, 10);

      const verificationTokenResponse = await db.query(
        `insert into request_reset_password_tokens(user_id, token) values($1, $2)`,
        [userResponse.id, hashToken]
      );

      if (verificationTokenResponse.rowCount) {
        const goood = await sendEmail(
          "signup",
          {
            email,
            token: requestSignupToken,
            id: userResponse.id,
          },
          next
        );
        console.log({ goood });
        db.query("COMMIT");
        res.send({
          message: "user register successfully!",
          requestSignupToken,
        });
        return;
      }
    }

    db.query("ROLLBACK");
    next("user not register");
  } catch (error) {
    console.error("register error is ", error.message);
    db.query("ROLLBACK");
    next(error);
  }
};

const verifyUserSignup = async (req, res, next) => {
  try {
    const { id, token, password } = req.body;
    const user = req.user;

    const response = await db.query(
      `select * from request_reset_password_tokens where 
    user_id=$1`,
      [id]
    );

    if (response.rowCount) {
      const userTokenRequest = response.rows[0];
      const isMatch = await brcypt.compare(token, userTokenRequest.token);
      console.log({ isMatch, userTokenRequest });
      if (isMatch) {
        const hashPassword = await brcypt.hash(password, 10);
        await db.query("BEGIN");
        await db.query(
          "update users set active_status=true, password=$1 where id=$2",
          [hashPassword, id]
        );
        await db.query(
          "delete from request_reset_password_tokens where user_id=$1",
          [id]
        );

        await sendEmail(
          "accountVerification",
          { email: user.email, password },
          next
        );
        await db.query("COMMIT");
        res.send({ message: "email account verified successfully" });
      }
    }
    await db.query("ROLLBACK");
    throw new CustomPropertyError(
      "email account can not verify",
      "email",
      UNPROCESSIBLE_ENTITY
    );
  } catch (error) {
    db.query("ROLLBACK");
    next(error);
  }
};

const requestForgotPassword = async (req, res, next) => {
  try {
    const user = req.user;

    const requestToken = crypto.randomBytes(10).toString("hex");
    const hashToken = await brcypt.hash(requestToken, 10);
    const response = await db.query(
      "insert into request_reset_password_tokens(user_id, token) values($1, $2)",
      [user.id, hashToken]
    );
    if (response.rowCount) {
      await sendEmail("requestForgotPassword", {
        token: requestToken,
        email: req.body.email,
      });
      res.send({ message: "reset password token send successfully!" });
    }
  } catch (error) {
    next(error);
  }
};

const resetForgotPassword = async (req, res, next) => {
  try {
    const { token, password, id } = req.body;

    const response = await db.query(
      `select * from request_reset_password_tokens 
    where user_id = $1`,
      [id]
    );

    if (response.rowCount) {
      const userTokenRequest = response.rows[0];

      const isMatch = await brcypt.compare(token, userTokenRequest.token);
      const hashPassword = await brcypt.hash(password, 10);
      if (isMatch) {
        await db.query("update users set password = $1 where id = $2", [
          hashPassword,
          id,
        ]);
        await db.query(
          "delete from request_reset_password_tokens where user_id = $1",
          [id]
        );
        return res.send({ message: "password reset successfully!" });
      }
      next("password reset failure!");
    }
    throw new CustomPropertyError(
      "password reset is not requested!",
      "password",
      UNPROCESSIBLE_ENTITY
    );
  } catch (error) {
    next(error);
  }
};

const passportLocalLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, message) => {
    if (!user) return res.status(UNAUTHORIZE).send({ error: message }); //throw new CustomError("invalid is here", UNAUTHORIZE);
    const token = generateToken(user);
    res.send({ token });
  })(req, res, next);
};

module.exports = {
  login,
  register,
  verifyUserSignup,
  requestForgotPassword,
  resetForgotPassword,
  passportLocalLogin,
};
