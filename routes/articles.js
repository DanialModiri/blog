const express = require('express');
const Article = require('../models/Article')
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const uuid = require('uuid')
const path = require('path')


const ALLOWED_EXTNAMES = [
    '.jpge',
    '.jpg',
    '.png',
    '.gif'
]

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.resolve(__dirname, '../public/images')
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const name = md5(uuid()) + path.extname(file.originalname);
        cb(null, name);
    },

})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (ALLOWED_EXTNAMES.includes(path.extname(file.originalname)))
            return cb(null, true);
        return cb(new Error('this file is not allowed'), false);
    }
})

const upload_images = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 16 }
]);

const upload_image_promise = (req, res) => {
    return new Promise((resolve, reject) => {
        upload_images(req, res, (err) => {
            if (err) {
                reject(err);
            }
            const images = (req.files['images'] || []).map(item => item.filename)
            resolve({
                images: images,
                image: req.files && req.files['image'] && req.files['image'][0] && req.files['image'][0].filename ? req.files['image'][0].filename : null
            });
        });
    });
};

router.post('/', async (req, res) => {
    const { image, images } = await upload_image_promise(req, res);
    const newArticle = new Article({
        ...req.body,
        image,
        images
    });
    await newArticle.save();
    res.send(newArticle);
});

const upload_edit_article = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'new_images', maxCount: 16 }
]);

function upload_edit_article_async(req, res) {
    return new Promise((resolve, reject) => {
        upload_edit_article(req, res, (err) => {
            if (err) {
                return reject(err);
            }
            const images = (req.files['new_images'] || []).map(item => item.filename)
            resolve({
                new_images: images,
                image: req.files && req.files['image'] && req.files['image'][0] && req.files['image'][0].filename ? req.files['image'][0].filename : undefined
            });
        });
    })
}

router.put('/:id', async (req, res) => {
    const { new_images, image } = await upload_edit_article_async(req, res);
    let newImage = {};
    if(image)
        newImage = { image: image }
    let images = [];
    if(Array.isArray(req.body.images) && req.body.images.length > 0)
        images = [...req.body.images, ...new_images];
    else if(!req.body.images)
        images = [...new_images]
    else
        images = [req.body.images, ...new_images]    
    console.log( { ...req.body, ...newImage, images: images } )
    const newArticle = await Article.findByIdAndUpdate(req.params.id,
         { ...req.body, ...newImage, images: images } ,
        { new: true, runValidators: true, useFindAndModify: true }).exec();
    res.send(newArticle);
})

router.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id).exec();
    res.send(article);
})

router.get('/', async (req, res) => {
    const articles = await Article.find().exec();
    res.send(articles);
})

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id).exec();
    res.send('حذف شد');
})

module.exports = router;