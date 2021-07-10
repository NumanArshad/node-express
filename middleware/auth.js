const jwt = require("jsonwebtoken");
const envVariables = require("../config/envVariables");
const {
  UNAUTHORIZE,
  UNPROCESSIBLE_ENTITY,
  FORBIDDEN,
  NOT_FOUND,
} = require("../config/httpStatusCode");
const { getUserByIdorEmail } = require("../controllers/users");
const { CustomError, CustomPropertyError } = require("./errorHandler");

const generateToken = (user) =>
  jwt.sign({ user }, envVariables.JWT_SECRET, { expiresIn: "2h" });

const verifyToken = (req, res, next) => {
  const bearer = req.headers["authorization"];

  if (bearer) {
    const token = bearer.split(" ")[1];
    jwt.verify(token, envVariables.JWT_SECRET, (err, authData) => {
      if (err) {
        console.error("token error is", err.message);
        res.status(401).json({ token_error: err.message });
        return;
        //  throw new CustomError(err)
      }
      console.log({ authData });
      next();
    });
  } else {
    console.error("tokken not provided");
    res.status(401).json({ token_error: "token not provided" });
  }
};

const getValidUser = async (req, res, next) => {
  try {
    const user = await getUserByIdorEmail(req.body);
    if (!user) {
      throw new CustomPropertyError("user not exist", "email", NOT_FOUND);
    } else if (!user.active_status && req.url !== "/activate-account") {
      throw new CustomPropertyError(
        "email is not verified",
        "email",
        FORBIDDEN
      );
    } else if (user.active_status && req.url === "/activate-account") {
      throw new CustomPropertyError(
        "email is verified already",
        "email",
        UNPROCESSIBLE_ENTITY
      );
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getValidUser,
};
