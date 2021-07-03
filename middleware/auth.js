const jwt = require("jsonwebtoken");
const { getUserByIdorEmail } = require("../controllers/users");

const generateToken = (user) =>
  jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "2h" });

const verifyToken = (req, res, next) => {
  const bearer = req.headers["authorization"];

  if (bearer) {
    const token = bearer.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.error("token error is", err.message);
        res.status(401).json({ token_error: err.message });
        return;
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
  const user = await getUserByIdorEmail(req.body);
  if (!user) {
    return res.status(404).send({
      error: {
        email: "user does not exist",
      },
    });
  }

  if (!user.active_status && req.url !== "/activate-account") {
    return res.status(403).send({ message: "email is not verified" });
  } else if (user.active_status && req.url === "/activate-account") {
    return res.status(422).send({ message: "email is verified already" });
  } else {
    req.user = user;
    next();
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getValidUser,
};
