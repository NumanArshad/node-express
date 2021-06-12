const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
//app.use(multer({ dest: "repos" }).single("image"));

app.use(express.json());

// const argv = require("yargs").argv;

// console.log({ argv }, argv.output);

// app.use(express.static(path.join(__dirname, "")))

app.set("view engine", "ejs");
//app.set("views", "./pages");
require("./db");
const { verifyToken } = require("./middleware/jwtUtils");
const usersRoutes = require("./routes/users");
const { body, validationResult } = require("express-validator");
const sendEmail = require("./utils/emails");
//app.use("/auth", require("./routes/auth"));

app.use("/users", usersRoutes);

app.use("/", require("./routes/fileHandling"));

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

app.get("/send", (req, res, next) => {
  sendEmail(
    "signup",
    { email: "test123@mailinator.com", password: "123" },
    res,
    next
  );
});

app.use((err, req, res, next) => {
  // res.status(500);
  console.error("error middleware", err);
  res.status(400).send({ message: err });
});

app.get("/", (req, res, next) => {
  console.log("response header always", req.headers);
  // res.setHeader("set-cookie", "loginned=true");
  res.send("shown on github actions");
});

// app.use((req, res) => {
//   // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
//   res.status(404).sendFile(path.join(__dirname, "pages", "notFound.html"));
// });

app.listen(process.env.PORT, () => console.log("running at 4000"));
