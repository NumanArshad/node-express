const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
//app.use(multer({ dest: "repos" }).single("image"));

app.use(express.json());

//  app.use(express.static(path.join(__dirname, "")))

// console.log({ argv }, argv.output);

// app.use(express.static(path.join(__dirname, "")))
const passport = require("passport");
const {
  localLoginStrategy,
  jwtAuthenticationStrategy,
  googleAuthStrategy,
  passportJwtVerify,
} = require("./middleware/auth");

app.use(passport.initialize());

passport.use(localLoginStrategy);
passport.use(jwtAuthenticationStrategy);
passport.use(googleAuthStrategy);
app.set("view engine", "ejs");
require("./db");
const usersRoutes = require("./routes/users");
const { body, validationResult } = require("express-validator");
const sendEmail = require("./utils/emails");
const { validateLoginRequest } = require("./middleware/validations/auth");
const {
  CustomError,
  isOperationalError,
} = require("./middleware/errorHandler");
const httpStatusCode = require("./config/httpStatusCode");
const envVariables = require("./config/envVariables");
app.use("/auth", require("./routes/auth"));

app.use("/users", usersRoutes);

const coursesRoute = require("./routes/courses")(app);
app.use("/courses", passportJwtVerify, require("./routes/courses"));
app.use("/teacher_courses", require("./routes/teacher_courses"));
app.use("/", require("./routes/fileHandling"));
app;
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

app.get("/healthCheck", (req, res, next) => {
  res.send("ok");
});

// app.post(
//   "/throw",
//   (req, res, next) => {
//     if (req.query.name === "user") throw new CustomError("not found", 404); //new CustomError("test it", 404);
//     if (req.query.name === "ali") return next();
//     res.send({ message: "not throw" });
//   },
//   (req, res) => {
//     res.send({ message: "good" });
//   }
// );

app.use((req, res) => {
  throw new CustomError("Not Found", httpStatusCode.NOT_FOUND);
});

// console.log("good for project github board");
// process.on("unhandledRejection", (error) => {
//   console.log("unhandle rejection", error);
//   throw error;
// });

process.on("uncaughtException", (error) => {
  // console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error("uncaught exception", {
    message: error.message,
    stack: error.stack,
  });
  //if (isOperationalError(error)) {
  process.exit(1);
  // }
});

app.use((err, req, res, next) => {
  console.log("error middleware", err);
  res
    .status(err.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
    .send({ error: err.message });
});

// app.use((req, res) => {
//   // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
//   res.status(404).sendFile(path.join(__dirname, "pages", "notFound.html"));
// });

app.listen(envVariables.PORT, () => console.log("running at 4000"));
