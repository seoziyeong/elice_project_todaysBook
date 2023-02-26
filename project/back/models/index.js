const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");
const OrderSchema = require("./schemas/order");
const ProductSchema = require("./schemas/product");

exports.User = mongoose.model("User", UserSchema);
exports.Order = mongoose.model("Order", OrderSchema);
exports.Product = mongoose.model("Product", ProductSchema);