


module.exports.mongoose_validator = (err, req, res, next) => {
    if (err && err.name && err.name === 'ValidationError') {
        return res.status(400).send(Object.keys(err.errors).map(error => err.errors[error].message));
    }
    next(err);
}

module.exports.last_validator = (err, req, res, next) => {
    console.log(err)
    res.status(500).send('Server Side Error');
}