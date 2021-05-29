const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
// const argv = require("yargs").argv;

// console.log({ argv }, argv.output);

// app.use(express.static(path.join(__dirname, "")))

// app.set("view engine", "ejs");
// app.set("views", "./pages");

// const adminProducts = require("./controllers/adminProducts");
const db = require("./db");
const usersRoutes = require("./routes/users");
// app.use("/admin", adminProducts);
app.use("/users", usersRoutes);
const middleware1 = (req, res, next) => {
  console.log("middleware 1");
  next();
};
const middleware2 = (req, res, next) => {
  console.log("middleware 2");
  next("route");
};
app.get("/add-product", [middleware1, middleware2], (req, res) => {
  // res.send(`<html><head><title>hello</title></head><body>
  //      <form  action="/product" method="POST">
  //      <input type="text" name="email" />
  //      <button type="submit"> save </button>
  //      </form>
  //      </body></html>`);
  const data = {
    name: "numan",
  };

  // res.send(JSON.stringify(data));
  res.redirect("/");
});

// const db = query

app.post("/product", (req, res, next) => {
  console.log("response body is", req.body);
  res.send("nice pretty!");
});

app.get("/users", (req, res) => {
  db.query(
    "select * from users where id>$1 and id<$2",
    [2, 6],
    (err, result) => {
      if (err) {
        console.log("erorr si");
        res.send("error" + err.message);
        return;
      }
      return res.status(200).send({ result: result.rows });
    }
  );
});

app.get("/ck", (req, res, next) => {
  console.log("redirect");
  res.setHeader("set-cookie", "loginned=true");
  res.redirect("/");
});

app.get("/", (req, res, next) => {
  console.log("response body always", req.get("cookie"));
  // res.setHeader("set-cookie", "loginned=true");
  res.send("always");
});

// app.use((req, res) => {
//   // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
//   res.status(404).sendFile(path.join(__dirname, "pages", "notFound.html"));
// });

app.listen(process.env.PORT, () => console.log("running at 4000"));
