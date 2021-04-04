let products = [];

module.exports = class Product {
    constructor({title, publisher}){
        this.title = title;
        this.publisher =  publisher;
    }
    save(){
        products.push(this)
    }
    delete(){
        products = products.filter(({title}) => title !== this.title);
    }
    static fetchAll(){
        return products;

    }
}