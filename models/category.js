const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true,
        lowercase: true
    }
});

const Category = mongoose.model('Category', categorySchema);

const validateCategory = param => {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(30)
            .required()
    };

    return Joi.validate(param, schema);
};

exports.Category = Category;
exports.validate = validateCategory;
exports.categorySchema = categorySchema;
