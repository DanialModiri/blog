const express = require('express');
const Admin = require('../models/Admin')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { jwtKey } = require('../config')
const { adminAuth, role } = require('../routes/middlewares/adminmiddleware')
const multer = require('multer')
const path = require('path')
const uuid = require('uuid')


const ALLOWED_FORMATS_FOR_AVATAR = [
    '.jpg',
    '.png',
    '.gif',
    '.jpeg'
]


router.post('/login', async (req, res) => {
    if(!req.body.username || !req.body.password)
        return res.status(400).send('Username and Password required');

    const admin = await Admin.findOne({ username: req.body.username }).exec();
    if(!admin)
        return res.status(401).send('نام کاربری یا رمز عبور اشتباه می‌باشد');
    console.log(req.body.password, admin.password)
    if(!bcrypt.compareSync(req.body.password, admin.password))
        return res.status(401).send('نام کاربری یا رمز عبور اشتباه می‌باشد');
    const admin_to_sign = _.pick(admin, ['username', 'name', '_id']);
    const token = jwt.sign(admin_to_sign, jwtKey);
    res.cookie('token', token);
    return res.send({
        token,
        profile: _.pick(admin, ['name', 'username', 'date', 'avatar'])
    });
})

router.get('/profile', adminAuth, (req, res) => {
    res.send(_.pick(req.admin, ['name', 'username', 'role', 'date', 'avatar','bio']));
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../admin_scripts/images'));
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        if (!ALLOWED_FORMATS_FOR_AVATAR.includes(ext))
            return cb('نوع فایل های انتخاب شده پشتیبانی نمیشود');
        const name = `${uuid()}.${ext}`
        cb(null, name);
    }
})

const admin_avatar_upload = multer({
    storage
})

const upload_avatar = admin_avatar_upload.fields([
    { name: 'avatar', maxCount: 1 }
]);

const upload_avatar_promise = (req, res) => {

    return new Promise((resolve, reject) => {
        upload_avatar(req, res, (err) => {
            if(err)
                return reject(err);
            console.log(req.files)
            resolve(
                req.files['avatar'][0].filename
            );
        })
    });
} 

router.post('/', adminAuth, role('SUPER_ADMIN'), async (req, res) => {
    
    const avatar = await upload_avatar_promise(req, res);
    const admin = new Admin({
        ...req.body, 
        avatar
    });
    await admin.save();
    res.send(
        _.pick(admin, ['username', 'name', 'date', 'avatar'])
    );
});

router.put('/:id', adminAuth, role('SUPER_ADMIN'), async (req, res) => {
    const avatar = await upload_avatar_promise(req, res);
    const newAdmin = await Admin.findByIdAndUpdate(req.params.id, {...req.body, avatar }, { new: true, runValidators: true }).exec();
    res.send(newAdmin);
});

router.get('/super', adminAuth, role('SUPER_ADMIN'), async (req, res) => {
    const admins = await Admin.find({});
    return res.send(admins);
})

router.get('/super/:id', adminAuth, role('SUPER_ADMIN'), async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
})

router.get('/', adminAuth, async (req, res) => {
    const admins = await Admin.find({}, ['name', 'username', 'date']).exec();
    res.send(admins);
});

router.get('/:id', adminAuth, async (req, res) => {
    const admin = await Admin.findById(req.params.id, ['name','username','avatar']).exec();
    res.send(admin);  
});

module.exports = router;