const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    first_name: String,
    last_name: String,
    password: { type: String, required: true, min: 8 },
    country: String,
    city: String,
    street: String,
    avatar: String,
    bio: String,
    date: { type: Date, default: Date.now },
    favoritesArticles: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Article' }]
})

UserSchema.methods.addToFavs = function (article) {
    this.favoritesArticles.push(article);
    return this.save();
}

UserSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

module.exports = mongoose.model('User', UserSchema);