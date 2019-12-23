const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// creates user Schema
let UserSchema = new mongoose.Schema({
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

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => {
        return token;
    })
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123')
    } catch (e) {
        console.log('decoded', e)
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'token.access': 'auth'

    });
};

// creates user model
let User = mongoose.model('User', UserSchema);

module.exports = User;