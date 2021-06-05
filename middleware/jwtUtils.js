const jwt = require("jsonwebtoken");

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

module.exports = {
  generateToken,
  verifyToken,
};
