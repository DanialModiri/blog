const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const AdminSchema = new mongoose.Schema({
    name: { type: String, minlength: 8 },
    username: { type: String, required: true, minlength: 5, unique: true },
    password: { type: String, required: true, minlength: 8 },
    avatar: { type: String },
    bio: { type: String },
    date: { type: Date, default: Date.now },
    role: { type: String, default: 'ADMIN', enum: ['ADMIN', 'SUPER_ADMIN'] },
    lastSockedId: {type: String, default: null}
});

AdminSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

module.exports = mongoose.model('Admin', AdminSchema);