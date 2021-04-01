var http = require("http");
var url = require("url");
var fs = require("fs");
var queryString = require("querystring");

var customModule = require("./customModule");

var indexFunc = require("./utility");
const { timeStamp } = require("console");
indexFunc()

customModule()

fs.readFile("asyncfile.txt", (err, data) => {
    if (err) throw err;
    console.log("read aysnc file succes sis", data)
})
var data = fs.readFileSync("syncfile.txt", "utf8");
console.log({ data })



// http.createServer((req, res)=>{
//     res.writeHead(200, {"Content-type":"text/html"});
//     var query = url.parse(req.url, true).pathname;
// console.log({query})
// //   var filepath = 
// //     res.write(`params are ${query.name} `)
// //     res.end('hello end')
// console.log("server createed success")
// fs.readFile("wint.html", (err, data)=>{
//     if(err){
//         console.log("error is", err)
//         //throw err
//         res.writeHead(404, {'Content-type': 'text/html'})
//         return res.end('404 Not Found')
//     }
//     res.writeHead(200, {'Content-type': 'text/html'})
//     return res.end(data)

// })
// }).listen(3000)
// const server = http.createServer((req, res) => {

//     const parsedUrl = url.parse(req.url, true).query;

//    // console.log({ parsedUrl })
//   //  console.log("query string is", queryString.parse(parsedUrl))

//     if (req.url === "/") {

//         f
//         // res.write("<html>");
//         // res.write("<header><title>Node title html is</title></head>");
//         // res.write(`<body>
//         // <form action="/message?name=ali" method="POST">
//         // <input type="text" name="message" />
//         // <button type="submit">Send</submit>
//         // </form></body>`);
//         // res.write("</html>");
//       //  res.writeHead(200, { "Content-type": "text/html" })

//         fs.readFile("winter.html", (err, response) => {
//             if (err) {
//                 console.log("error is", err)
//                 //throw err

//                 res.writeHead(404, { 'Content-type': 'text/html' })
//                 return res.end('404 Not Found')
//             }
//             console.log("hey response is", response)
//             res.writeHead(200, { 'Content-type': 'text/html' })

//             return res.end(response)
//         })

//         // return res.end();
//     }
//     if(req.url === "/message"){
//         const body = [];
//         req.on("data", chunk => 
//         body.push(chunk)
//         )
//         req.on("end",()=>{
//           console.log("end response handler ")
//           const parsedBody = Buffer.concat(body).toString();
//           const message = parsedBody.split("=")[1];
//           fs.writeFileSync("message.txt", message);
//           res.statusCode=302;
//           res.statusMessage="location change";
//           res.setHeader("Location","/");
//          //  res.end()
//           return res.end()
          
//       })

       
//     }
 
//     res.setHeader("Content-type", "text/html")
//     res.write("<html>");
//     res.write("<header><title>My first</title></head>");
//     res.write(`<body><h1>kfeknrg ${parsedUrl.name}</h1></body>`);
//     res.write("</html>");
//     res.end();
// })



// server.listen(3000)

 http.createServer((req, res)=>{
    const parseUrl = url.parse(req.url, true);

    console.log({parseUrl})
    if(req.url === "/get"){

        // res.writeHead(302,{"Location": "/get1?name=haider", });
        // res.writeHead(402, {"Content-type":"text/html"})
        // let data = {
        //     name: "numan",
        //     age:"22"
        // }
        // res.write(JSON.stringify(data))
        res.setHeader("Location","/get1?name=knj")
        res.statusMessage="Location ..."
        res.statusCode = 302;
        return res.end()
    }
    if(parseUrl.pathname === "/get1"){

        res.writeHead(404, {"Content-type":"text/html"})
        console.log("before")
        try{
            var data = fs.readFileSync("params.txt","utf8")

        }
        catch(err){
            console.error("error in sync read is", err)
        }
        console.log("after", data)

        res.write("<html>");
        res.write("<header><title>My first</title></head>");
        res.write(`<body><h1>kfeknrg ${data}</h1></body>`);
        res.write("</html>");    
        res.end()
    }
}).listen(4000)