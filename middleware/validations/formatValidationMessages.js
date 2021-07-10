const { validationResult } = require("express-validator");
const httpStatusCode = require("../../config/httpStatusCode");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  const customError = {};

  if (errors.isEmpty()) return next();

  for (let error of errors.array()) {
    const { param, msg } = error;
    if (customError[param]) continue;
    customError[param] = msg;
  }

  console.log({ customError });

  res.status(httpStatusCode.BAD_REQUEST).json({ error: customError });
};
