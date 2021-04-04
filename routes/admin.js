
const router = require("express").Router();
const path = require("path"); ///absolute path 
const rootDir = require("../utils/path");
const fs = require("fs");
const {
    renderProducts,
    getAddProduct,
    postAddProduct,
    deleteSingleProduct 
} = require("../controllers/productsController");

// console.log({rootDir})

router.get("/", (req, res) => {
    //__DIRNAME is absolute path of current file
    // res.sendFile(path.join(__dirname,"../","views","shop.html")) 
    // res.sendFile(path.join(__dirname,"../views/shop.html"))    


    // fs.readFile("/public/css/data.txt", (err, data) => {
    //     if(err) 
    //     {
    //         console.log({err})
    //     res.send("error in read");
    //  return   ; 
    // }
    //     console.log({data})
    //     res.send(data)
    // })

    res.sendFile(path.join(rootDir, "public/css/data.txt"))

}


    // //res.render("hello from admin"))
)

router.get("/new-product", (req, res) => {
    //__DIRNAME is absolute path of current file
    // res.sendFile(path.join(__dirname,"../","views","shop.html"))    
    res.sendFile(path.join(__dirname, "../views/newProduct.html"))

})

router.post("/new-product", (req, res) => {
    //__DIRNAME is absolute path of current file
    // res.sendFile(path.join(__dirname,"../","views","shop.html"))    
    console.log("requets body si", req.body.product_name)

    res.sendFile(path.join(__dirname, "../views/shop.html"))

})

router.get("/products", renderProducts
    // (req, res) => {
    //     let products = [
    //         {
    //             title: "first book",
    //             publisher: "dogger"
    //         },
    //         {
    //             title: "sceond book",
    //             publisher: "wrf"
    //         }, {
    //             title: "third book",
    //             publisher: "wwd"
    //         },
    //     ]
    //     res.render("products", {
    //         products,
    //         pageTitle: "show products"
    //     }
    //     )
    //     //render mean to send view file
    //     /// in ejs  <%=  %> for inline expression
    //     /// <% %> fpr multine execution
    // }
)

router.get("/add-product", getAddProduct)
router.post("/add-product", postAddProduct, renderProducts)

router.post("/delete-product/:title", deleteSingleProduct, renderProducts)


module.exports = router;