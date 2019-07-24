const mongoose =require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category', default: null},
    image: { type: String }
})


module.exports = mongoose.model('Category', CategorySchema);