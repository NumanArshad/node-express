const jwt = require("jsonwebtoken");
const brcypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtracjJWT = passportJWT.ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
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
const { default: axios } = require("axios");
const httpStatusCode = require("../config/httpStatusCode");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = envVariables;

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

const renderLoginGithubPage = (req, res) => {
  res.render("githubLogin", { clientId: envVariables.GITHUB_CLIENT_ID });
};

const githubAuthRedirect = (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param

  const requestToken = req.query.code;
  console.log({ requestToken });
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = envVariables;
  axios({
    // make a POST request
    method: "post",
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token;
    // redirect the user to the welcome page, along with the access token
    if (response.data.error) {
      res.status(httpStatusCode.BAD_REQUEST).send(response.data);
      return;
    }
    res.send({ accessToken });
  });
};

const googleAuthStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/oauth/google/redirect",
  },
  (accessToken, refreshToken, profile, done) => {
    console.log({ accessToken, refreshToken, profile });
    return done(null, profile);
  }
);

const googleAuthCallback = (req, res, next) =>
  passport.authenticate("google", (error, user, message) => {
    // if (!user) return res.status(UNAUTHORIZE).send({ error: message }); //throw new CustomError("invalid is here", UNAUTHORIZE);
    // const token = generateToken(user);
    console.log({ error, user, message });
    res.send({ data: user?._json });
  })(req, res, next);

module.exports = {
  generateToken,
  verifyToken,
  getValidUser,
  localLoginStrategy,
  jwtAuthenticationStrategy,
  passportJwtVerify,
  renderLoginGithubPage,
  githubAuthRedirect,
  googleAuthStrategy,
  googleAuthCallback,
};
