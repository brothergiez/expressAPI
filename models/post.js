const mongoose = require('mongoose');
const Joi = require('joi');
const { authorSchema } = require('./user');
const { categorySchema } = require('./category');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    author: {
        type: authorSchema,
        required: true
    },
    category: {
        type: categorySchema,
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 100
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    publishDate: {
        type: Date,
        require: true,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);

const validatePost = post => {
    const schema = {
        title: Joi.string()
            .min(5)
            .max(255)
            .required()
            .trim(),
        slug: Joi.string()
            .min(5)
            .max(255)
            .trim(),
        authorId: Joi.objectId().required(),
        categoryId: Joi.objectId().required(),
        content: Joi.string()
            .min(100)
            .required(),
        createDate: Joi.date()
    };
    return Joi.validate(post, schema);
};

exports.Post = Post;
exports.validate = validatePost;
