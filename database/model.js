const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    Name: String,
    Description: String,
    Quantity: Number,
    Price: Number,
});

const user = new Schema({
    Name: String,
    Password: String,
    Address: String,
    Email: String
});

const cart = new Schema({
    Email: String,
    Product: [{
        Name: String,
        Description: String,
        Quantity: Number,
        Price: Number,
        ProductId: String
    }]
});

module.exports.userModel = mongoose.model("Users", user, "Users");
module.exports.cartModel = mongoose.model("Cart", cart, "Cart");
module.exports.productModel = mongoose.model("Products", product, "Products");