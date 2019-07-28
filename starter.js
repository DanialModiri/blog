const Admin = require('./models/Admin');
const Category = require('./models/Category')
const mongoose = require('mongoose');
const _ = require('lodash')

async function addAdmin() {

    await Admin.findOneAndDelete({ username: 'DanialModiri' });

    const admin = new Admin({
        name: 'Danial Modiri',
        username: 'DanialModiri',
        password: '12345678',
        avatar: '2c836597fd8decbe11292c3bf0a16f96.jpg',
        bio: 'Nothing',
        role: 'SUPER_ADMIN'
    })

    await admin.save();
}

async function addTree() {
    const ids = {};
    _.range(1, 11).forEach(item => {
        ids[item] = mongoose.Types.ObjectId();
    })

    const tree = [
        { _id: ids[1], title: 'کالای دیجیتال', parent: null },
        { _id: ids[2], title: 'موبایل', parent: ids[1] },
        { _id: ids[3], title: 'لپتاپ', parent: ids[1] },
        { _id: ids[4], title: 'کنسول بازی', parent: ids[1] },
        { _id: ids[5], title: 'سامسونگ', parent: ids[2] },
        { _id: ids[6], title: 'پلی استیشن', parent: ids[4] },
        { _id: ids[7], title: 'ایفون', parent: ids[2] },
        { _id: ids[8], title: 'ایکس باکس', parent: ids[4] },
        { _id: ids[9], title: 'لوازم خانگی', parent: null },
        { _id: ids[10], title: 'آشپزخانه', parent: ids[9] },
        { _id: ids[11], title: 'لوازم برقی', parent: ids[10] }
    ];
    await Category.insertMany(tree, { s });
}

mongoose.connect('mongodb://localhost:27017/blog', async () => {
    await addAdmin();
    await addTree();
    mongoose.disconnect();
})


