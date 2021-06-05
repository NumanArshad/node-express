const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// const argv = require("yargs").argv;

// console.log({ argv }, argv.output);

// app.use(express.static(path.join(__dirname, "")))

// app.set("view engine", "ejs");
// app.set("views", "./pages");
const db = require("./db");
const { verifyToken } = require("./middleware/jwtUtils");
const usersRoutes = require("./routes/users");
const { body, validationResult } = require("express-validator");
app.use("/auth", require("./routes/auth"));

app.use("/users", verifyToken, usersRoutes);

// handler for the /user/:id path, which sends a special response
// app.get("/user/:id", function (req, res, next) {
//   res.send("special");
// });

// const db = query

// app.get("/dt", (req, res, next) => {
//   const err = new Error("custom error");
//   //  console.log("error is", err.message, err.stack);
//   next(err);
// });

app.post("/verify", [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email format invalid"),
  body("name", "enter name please").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    let customError = {};
    for (let error of errors.array()) {
      const { param, msg } = error;
      if (customError[param]) continue;
      customError[param] = msg;
    }

    res.json(customError);
  },
]);

app.use((err, req, res, next) => {
  // res.status(500);
  console.error("error middleware", err);
  res.status(400).send({ message: err });
});

// app.get("/", (req, res, next) => {
//   console.log("response header always", req.headers);
//   // res.setHeader("set-cookie", "loginned=true");
//   res.send("always");
// });

// app.use((req, res) => {
//   // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
//   res.status(404).sendFile(path.join(__dirname, "pages", "notFound.html"));
// });

app.listen(process.env.PORT, () => console.log("running at 4000"));
