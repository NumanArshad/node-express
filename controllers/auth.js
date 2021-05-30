const brcypt = require("bcrypt");
const db = require("../db/index");
const { generateToken } = require("../middleware/jwtUtils");
const { isUserExist } = require("./users");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await isUserExist(email);

    if (!user) {
      res.status(404).send({
        error: {
          email: "user does not exist",
        },
      });
      return;
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
  const { email, password, username } = req.body;

  try {
    const user = await isUserExist(email);
    if (user) {
      res.status(422).send({
        error: {
          email: "email exist already",
        },
      });
      return;
    }

    const hashPassword = await brcypt.hash(password, 10);

    console.log({ hashPassword });
    const response = await db.query(
      "insert into users (username, email, password) values ($1, $2, $3) RETURNING *",
      [username, email, hashPassword]
    );
    if (response.rowCount) {
      console.log(response.rows[0]);
      const { password: pwrd, ...rest } = response.rows[0];
      const token = generateToken(rest);
      res.send({
        message: "user register successfully!",
        token,
      });
      return;
    }

    next("user not register");
  } catch (error) {
    next(error.message);
  }
};

module.exports = {
  login,
  register,
};
