let products = [];

const path =  require("path");
const fs = require("fs");

const rootPath = require("../utils/path");
const { response } = require("express");
// const { response } = require("express");
module.exports = class Product {
    constructor({title, publisher}){
        this.title = title;
        this.publisher =  publisher;
    }
    save(){
        // const products = [];
        let product = [];
        const targetPath = path.join(rootPath,"data","products.json");
        fs.readFile(targetPath,
        (error, data) => {
            if(!error){
                product = JSON.parse(data);
            }
            // console.log("this is", this, product)
            product.push(this);
            // console.log("appended is", product)
             fs.writeFile(targetPath, JSON.stringify(product),
             (err) => {
                 console.log("data is", err)

             });
        })
      
        // products.push(this)
    }
    delete(){
        products = products.filter(({title}) => title !== this.title);
    }

    static fetchAll(cb){
       fs.readFile(path.join(rootPath,"data","products.json"),
       (err, content) => {
           if(err){
               console.log({content})
               cb([])
               return;
           }
            console.log("content is", JSON.parse(content))
           cb(JSON.parse(content))
       })
        //  return products;
    }
}