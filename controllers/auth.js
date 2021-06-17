const brcypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../db/index");
const { generateToken } = require("../middleware/jwtUtils");
const sendEmail = require("../utils/emails");
const { isUserExist } = require("./users");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await isUserExist({ email });

    if (!user) {
      res.status(404).send({
        error: {
          email: "user does not exist",
        },
      });
      return;
    }
    console.log({ user });

    if (!user.active_status) {
      return res.status(401).send({
        error: {
          email: "email not verified",
        },
      });
    }

    const isMatch = await brcypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).send({
        error: {
          password: "invalid credential",
        },
      });
      return;
    }

    const { password: pswrd, ...restUserInfo } = user;

    const token = generateToken(restUserInfo);
    res.send({ token });
  } catch (error) {
    next(error.message);
  }
};

const register = async (req, res, next) => {
  const { email, username } = req.body;

  try {
    const user = await isUserExist({ email });
    if (user) {
      res.status(422).send({
        error: {
          email: "email exist already",
        },
      });
      return;
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

      // console.log({ verificationTokenResponse });

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
    next(error.message);
  }
};

const verifyUserSignup = async (req, res, next) => {
  try {
    const { id, token, password } = req.body;
    const user = await isUserExist({ id });

    if (user.active_status) {
      return res.status(422).send({ message: "email is verified already" });
    }
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
        await db.query(
          "update users set active_status=true, password=$1 where id=$2",
          [hashPassword, id]
        );
        await db.query(
          "delete from request_reset_password_tokens where user_id=$1",
          [id]
        );

        res.send({ message: "email account verified successfully" });
      }
    }

    return res.status(422).send({ message: "email account can not verify" });
  } catch (error) {
    next(error.message);
  }
};

module.exports = {
  login,
  register,
  verifyUserSignup,
};
