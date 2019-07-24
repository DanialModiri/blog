const Admin = require('../../models/Admin')
const jwt = require('jsonwebtoken')
const { jwtKey } = require('../../config')

module.exports.adminAuth = async (req, res, next) => {
    if(!req.cookies['token'])
        return res.status(401).send('');
    const decoded = jwt.decode(req.cookies['token'], jwtKey);
    const admin = await Admin.findById(decoded._id);
    if(!admin)
        return res.status(401).send('');
    req.admin = admin;
    next();
}

module.exports.role = (role) => (req, res, next) => {
    
    if(role !== req.admin._doc.role){
        return res.status(403).send('شما حق دسترسی به این بخش را ندارید');
    }
    next();
}