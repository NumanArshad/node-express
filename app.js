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
const { verifyToken } = require("./middleware/auth");
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

//const coursesRoute = require("./routes/courses")(app);
app.use("/courses", require("./routes/courses"));
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
  res.send("okay");
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

// process.on("unhandledRejection", (error) => {
//   console.log("unhandle rejection", error.name);
//   throw error;
// });

process.on("uncaughtException", (error) => {
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
  // if (isOperationalError(error)) {
  process.exit(1);
  // }
});

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
    .send({ error: err.message });
});

// app.use((req, res) => {
//   // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
//   res.status(404).sendFile(path.join(__dirname, "pages", "notFound.html"));
// });

app.listen(envVariables.PORT, () => console.log("running at 4000"));
