const mongoose = require('mongoose');


const LikeSchema = new mongoose.Schema({
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    comment: { type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' },
    date: { type: Date, default: Date.now },
})

LikeSchema.index({ user: 1, comment: 1 }, { unique: true })


module.exports = mongoose.model("Like", LikeSchema);