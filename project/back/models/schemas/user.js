const { Schema } = require("mongoose");
const nanoId = require("./types/nano-id");

// address 객체 분리
const address = {
    postalCode: {
        type: String,
        required: false,
    },
    address1: {
        type: String,
        required: false,
    },
    address2: {
        type: String,
        required: false,
    },
};

const UserSchema = new Schema({
    address,
    userId: nanoId,
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    activate: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = UserSchema;