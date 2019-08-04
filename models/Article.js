const mongoose = require('mongoose');

const ArticleSchema =  new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    images: [String],
    image: String,
    views: {type: Number, min: 0},
    date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Article', ArticleSchema);