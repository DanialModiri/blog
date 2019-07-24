const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from: {type: mongoose.SchemaTypes.ObjectId, ref: 'Admin'},
    to: {type: mongoose.SchemaTypes.ObjectId, ref: 'Admin'},
    body: {type: String,},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', MessageSchema)