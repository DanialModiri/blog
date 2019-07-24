const express = require("express");
const router = express.Router();
const CategoryModule = require('../Tree/category')
const Category = require('../models/Category')
const { role, adminAuth } = require('./middlewares/adminmiddleware')

router.get('/search', async (req, res) => {
    if(req.query.q.length < 3)
        return res.send([]);
    const categories = await Category.find({ title: { $regex: `.*${req.query.q}.*` } }).exec();
    res.send(categories);
})

router.get('/', async (req, res) => {
    const categoryM = new CategoryModule(Category);
    const categories = await categoryM.getDefaultTreeView();
    res.send(categories);
})

router.post('/', adminAuth, async (req, res) => {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.send(newCategory);
});

router.put('/:id', adminAuth, async (req, res) => {
    const newCategory = await Category.findByIdAndUpdate(req.params.id, req.body).exec();
    res.send(newCategory);
})

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id).exec();
    res.send(category);
})

router.delete('/:id', adminAuth, role('SUPER_ADMIN'), async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id).exec();
    res.send(category);
})

module.exports = router;