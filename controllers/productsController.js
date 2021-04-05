const Product = require("../models/product")

let products = [
    {
        title: "first book",
        publisher: "dogger"
    },
    {
        title: "sceond book",
        publisher: "wrf"
    }, {
        title: "third book",
        publisher: "wwd"
    },
]


exports.renderProducts = (req, res, next) => {
    Product.fetchAll(products => {
        console.log("nice product is", products)
        res.render("products", {
            products: products,
            pageTitle: "show products"
        })
    })
    // res.render("products", {
    //     products: Product.fetchAll(),
    //     pageTitle: "show products"
    // })
}
exports.getAddProduct = (req, res, next) => {
    res.render("addProduct",
        { pageTitle: "new product" })
}

exports.postAddProduct = (req, res, next) => {
    // res.render("addProduct", {pageTitle: "new product"})
    const newProduct = new Product(req.body);
    newProduct.save();
    // products.push(req.body)
    // console.log("reque st body is",
    //     req.body)
    // res.send("post add proiduct")
    // res.render("products", {
    //     products,
    //     pageTitle: "All Products"
    // })
    res.redirect("/admin/products")
}

exports.deleteSingleProduct = (req, res, next) => {
    // products = products.filter(({ title }) => title !== req.params.title)
    // next()
    const deleteProduct = new Product({ title: req.params.title });
    deleteProduct.delete()
    res.redirect("/admin/products")
}

