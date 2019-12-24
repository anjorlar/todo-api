const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = async function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123')
        return User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'

        });
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        return Promise.reject();
    }
};
UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next()
            });
        });
    } else {
        next()
    }
});
let User = mongoose.model('User', UserSchema);

module.exports = User;