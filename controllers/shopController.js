const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("shop/product-list", {
            products: products,
            pageTitle: "Shop Products"
        })
    })
}

exports.getProductById = (req, res, next) => {
    console.log("param is", req.params.id)
    Product.findById(req.params.id, product => 
        {
            console.log("lwf", product)
            res.render(
                "shop/product-detail",
               { product:product,
                pageTitle: "view product"})
        })
      
}

exports.getIndex= (req, res, next) => {
    Product.fetchAll(products => {
        res.render("shop/index", {
            products: products,
            pageTitle: "Shop Index"
        })
    })
}

exports.getCart= (req, res, next) => {
        res.render("shop/cart", {
            pageTitle: "Shop Cart"
        })
}

exports.getCheckout= (req, res, next) => {
    res.render("shop/checkout", {
        pageTitle: "Shop Checkout"
    })
}