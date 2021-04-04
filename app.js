// const http = require("http");
const chalk = require('chalk');
require('dotenv').config();

const port = process.env.PORT || 4000;

const express = require("express")
const app = express();
const bodyParser = require("body-parser");

const path = require("path");

///server statically mean to access file directly from browser by file path rather than
//by defining their path
//for this purpose we use
///here we want public to server statically mean accessible without public folder file path

app.use(express.static(path.join(__dirname, "public")))

app.set("view engine","ejs")
app.set("views","./views") //default render view route ("./views or views")
////In older version express.encoded or json is not available so bodyparser use
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const adminRoute = require("./routes/admin");
const noFoundController = require('./controllers/noFoundController');
////middleware///
// app.use((req, res, next) => {
//   console.log("logger middleware")
//   req.var = "data from first";
//   next()
// })
app.use("/admin",adminRoute)
app.use("/user/:id",(req, res, next) => {
  console.log("user id middleware", req.method)
  next()
})

app.get("/user/:id",(req, res, next) => {
//  res.send(`user is ${req.params.id}`)
 //skip rest of middleware in this stack
 if(req.params.id === '0') next("route");

 
 else next();
}, 
(req,res, next) => {
  console.log(chalk.whiteBright("regular"))
})

function logRequestUrl (req, res, next){
  console.log("log url is", Date.now(), req.originalUrl);
  next()
}

function logRequestMethod (req, res, next) {
  console.log("log url method is", req.method);
  next()
}


app.get("/user/:id",[logRequestUrl, logRequestMethod] ,(req, res) => {
  console.log("special is")
  res.send("special come is")
})
////add-product here mean for any method of /add-product
app.use("/add-product", (req, res) => {
    res.send(`<form action="/product" method="POST">
    <input type="text" name="title" />
    <button type="submit">
    add product
    </button
    </form>`)
})
///////for specific method/////
//app.get("/add-product")

app.post("/product", (req, res) => {
    console.log("hey",req.body )
   // res.send("in prodicy")
   res.redirect("/admin")
})

///if path not found form above, then no response will send and below will execute
//if any above match res send and below will never execute as res has send

app.use((req, res)=>{
  // console.log("top is")
  // res.status(404).send("<h1>Not Found</h1>")
  // res.status(404).sendFile(path.join(__dirname,"views/404.html"))
 res.render("404",{pageTitle: "not found page"})
})
// app.use(noFoundController.noFound)
////Not found path////



////not found path////

////middleware///
// app.use((req, res, next) => {
//     console.log("logger middleware 2")
//     console.log(chalk.bgGrey(`req from first middleare is ${req.var}`))
//     ///any type///
//     res.send("end")
    ///any type///
// })

// ///////// type specified////////
// res.writeHead(200, {
//     "Content-type": "text/html",
//     "statusMessage": "w4t",
//     "Location":"/"
// })
// res.write("wmle")
//     res.end()

// /////////
// res.setHeader("Content-type", "text/html")
// res.statusCode= 200
// res.location = "/"
// res.write("wmle")
//     res.end()
//   })
// ///////// type specified////////

app.listen(port,()=>{
    console.log(
        `${chalk.green('✓')} ${chalk.blue(
          `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
        )}`)    
})

// server.listen("2000", ()=>console.log("successuflly connected"))
