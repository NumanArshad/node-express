let products = [];
const path = require("path");
const fs = require("fs");
const rootPath = require("../utils/path");

const targetPath = path.join(rootPath, "data", "products.json")

const getProductFromFile = (cb) => {
    fs.readFile(targetPath, (err, data) => {
        if (err) {
            cb([]);
            return;
        }
        cb(JSON.parse(data))
    })
}

module.exports = class Product {
    constructor({ title, publisher, id }) {
        console.log({ title, publisher })
        this.title = title;
        this.publisher = publisher;
        this.id = id
    }
    save() {
        // const products = [];
        let product = [];
        // const targetPath = path.join(rootPath, "data", "products.json");
        // fs.readFile(targetPath,
        //     (error, data) => {
        //         if (!error) {
        //             product = JSON.parse(data);
        //         }
        //         product.push(this);
        //         fs.writeFile(targetPath, JSON.stringify(product),
        //             (err) => {
        //             });
        //     })
        // products.push(this)

        getProductFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(({ id }) => id === this.id);
                const updateProducts = [...products];

                updateProducts[existingProductIndex] = this;
                fs.writeFile(targetPath, JSON.stringify(updateProducts), err => console.log({ err }))
            }
            else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(targetPath, JSON.stringify(products), (err) => {
                    if (err) {
                        console.log("error in writing is", err)
                    }
                })
            }
        }
        )
    }
    static delete(deleteId) {
        // products = products.filter(({ title }) => title !== this.title);
        getProductFromFile(products => {
            console.log({ products, deleteId })
            let updateProducts = products.filter(({ id }) => id !== deleteId);
            console.log({ updateProducts })

            fs.writeFile(targetPath, JSON.stringify(updateProducts), (err) => {
                if (err) {
                    console.log("error in writing is", err)
                }
            })
        })
    }

    static findById(productId, cb) {
        getProductFromFile(products => {
            let product = products.find(({ id }) => id === productId);
            cb(product)
        })
    }

    static fetchAll(cb) {
        getProductFromFile(cb)
        // fs.readFile(path.join(rootPath, "data", "products.json"),
        //     (err, content) => {
        //         if (err) {
        //             console.log({ content })
        //             cb([])
        //             return;
        //         }
        //         // console.log("content is", JSON.parse(content))
        //         cb(JSON.parse(content))
        //     })
        //  return products;
    }
}