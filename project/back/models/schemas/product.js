const { Schema } = require("mongoose");
const nanoId = require("./types/nano-id");

const ProductSchema = new Schema({
    productId: nanoId,
    productName: {
        type: String,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    activate: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true,
});

module.exports = ProductSchema;