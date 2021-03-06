const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 2
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    avatar: {
        type: String,
        minlength: 5,
        maxlength: 255
    }
});

const authorSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get('jwtPrivateKey')
    );
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user, field = null) {
    const joiSchema = {
        first_name: Joi.string()
            .min(2)
            .max(30)
            .required(),
        last_name: Joi.string()
            .min(2)
            .max(30)
            .required(),
        email: Joi.string()
            .min(5)
            .max(50)
            .email()
            .required(),
        password: Joi.string()
            .min(5)
            .max(1024)
            .required(),
        isAdmin: Joi.boolean(),
        isActive: Joi.boolean(),
        lastLogin: Joi.date(),
        avatar: Joi.string()
    };

    if (!field) {
        return Joi.validate(user, joiSchema);
    } else {
        const dynamicSchema = Object.keys(joiSchema)
            .filter(key => field.includes(key))
            .reduce((obj, key) => {
                obj[key] = joiSchema[key];
                return obj;
            }, {});

        return Joi.validate(user, dynamicSchema);
    }
}

exports.User = User;
exports.validate = validateUser;
exports.authorSchema = authorSchema;
exports.userSchema = userSchema;
