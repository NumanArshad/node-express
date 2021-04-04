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
    res.render("products", {
        products,
        pageTitle: "show products"
    })
}
exports.getAddProduct = (req, res, next) => {
    res.render("addProduct",
        { pageTitle: "new product" })
}

exports.postAddProduct = (req, res, next) => {
    // res.render("addProduct", {pageTitle: "new product"})
    products.push(req.body)
    console.log("reque st body is",
        req.body)
    // res.send("post add proiduct")
    // res.render("products", {
    //     products,
    //     pageTitle: "All Products"
    // })
    next()
}

exports.deleteSingleProduct = (req, res, next) => {
    products = products.filter(({ title }) => title !== req.params.title)
    // next()
    res.redirect("/admin/products")
}

