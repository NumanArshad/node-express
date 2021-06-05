const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  const customError = {};

  if (errors.isEmpty()) return next();

  for (let error of errors.array()) {
    const { param, msg } = error;
    if (customError[param]) continue;
    customError[param] = msg;
  }

  res.status(400).json({ error: customError });
};
