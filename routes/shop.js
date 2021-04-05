
const router = require("express").Router();
const { 
    getIndex,
    getProducts,
    getCart,
    getProductById,
    getCheckout
 } = require("../controllers/shopController");

router.get("/", getIndex)
router.get("/products",getProducts )
router.get("/products/detail/:id",getProductById )
router.get("/cart", getCart)
router.get("/checkout", getCheckout)

module.exports = router;