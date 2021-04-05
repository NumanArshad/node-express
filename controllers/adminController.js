const Product = require("../models/product")

exports.renderProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("admin/products", {
            products: products,
            pageTitle: "show admin products"
        })
    })
}

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-edit-product",
        {
            pageTitle: "new admin product",
            editMode: false
        })
}

exports.getEditProduct = (req, res, next) => {
    Product.findById(req.params.id, product => {
        res.render("admin/add-edit-product",
        {
            pageTitle: "new admin product",
            editMode: true,
            product
        })
    })
   
}

exports.postAddProduct = (req, res, next) => {
    const newProduct = new Product(req.body);
    newProduct.save();
    res.redirect("/admin/products")
}

exports.postEditProduct = (req, res, next) => {
    const updatedPayload = {...req.body, ...req.params};
    console.log("param sis", updatedPayload)

    const newProduct = new Product(updatedPayload);
    newProduct.save();
    res.redirect("/admin/products")
}

exports.deleteSingleProduct = (req, res, next) => {

    Product.delete(req.params.id)
    res.redirect("/admin/products")
}