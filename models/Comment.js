const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: { type: String, },
    article: { type: mongoose.SchemaTypes.ObjectId, ref: 'Article' },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comment', commentSchema);