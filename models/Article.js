const mongoose = require('mongoose');

const ArticleSchema =  new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    images: [String],
    image: String
})

module.exports = mongoose.model('Article', ArticleSchema);