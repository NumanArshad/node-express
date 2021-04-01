// const http = require("http");
const chalk = require('chalk');
require('dotenv').config();

const port = process.env.PORT || 4000;

const express = require("express")
const app = express();
const bodyParser = require("body-parser");



////In older version express.encoded or json is not available so bodyparser use
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.urlencoded({extended: true}))
app.use(express.json())

////middleware///
// app.use((req, res, next) => {
//   console.log("logger middleware")
//   req.var = "data from first";
//   next()
// })

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
    res.send("in prodicy")
})

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
