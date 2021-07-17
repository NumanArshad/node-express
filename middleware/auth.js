const jwt = require("jsonwebtoken");
const brcypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtracjJWT = passportJWT.ExtractJwt;
const envVariables = require("../config/envVariables");
const {
  UNAUTHORIZE,
  UNPROCESSIBLE_ENTITY,
  FORBIDDEN,
  NOT_FOUND,
} = require("../config/httpStatusCode");
const { getUserByIdorEmail } = require("../controllers/users");
const { CustomError, CustomPropertyError } = require("./errorHandler");
const { JWT_SECRET } = require("../config/envVariables");
const passport = require("passport");

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

const localLoginStrategy = new localStrategy(
  { usernameField: "email", passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const { password: encryptPassword, ...userInfo } = req.user;
      const isMatch = await brcypt.compare(password, encryptPassword);

      if (!isMatch) {
        return done(null, false, "invalid credential");
      }
      return done(null, userInfo);
    } catch (error) {
      return done(error);
    }
  }
);

const jwtAuthenticationStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtracjJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  (payload, done) => {
    // console.log({ payload });
    return done(null, payload);
  }
);

const passportJwtVerify = (req, res, next) => {
  passport.authenticate("jwt", (error, jwtPayload, msg) => {
    if (error || !jwtPayload) {
      return res.status(UNAUTHORIZE).send({ token_error: msg.message });
    }
    next();
  })(req, res, next);
};

module.exports = {
  generateToken,
  verifyToken,
  getValidUser,
  localLoginStrategy,
  jwtAuthenticationStrategy,
  passportJwtVerify,
};
