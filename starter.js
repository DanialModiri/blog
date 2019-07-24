const Admin = require('./models/Admin');
const mongoose = require('mongoose');


function addAdmin() {

    const admin = new Admin({
        name: 'Danial Modiri',
        username: 'DanialModiri',
        password: '12345678',
        avatar: '2c836597fd8decbe11292c3bf0a16f96.jpg',
        bio: 'Nothing',
        role: 'SUPER_ADMIN'
    })

    admin.save((err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(res)
        mongoose.disconnect();
    });
}


mongoose.connect('mongodb://localhost:27017/blog', () => {
    addAdmin();
})


