const mongoose = require('mongoose');
const validator = require('validator');

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        // validate: function (value) {
        //     return validator.isEmail(value)
        // },
        // message: `${value} is not a valid email`
        validate: {
            validator: validator.isEmail,
        },
        message: `please input a valid email`
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = User;