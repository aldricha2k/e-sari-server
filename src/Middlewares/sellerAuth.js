const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Seller = mongoose.model('Seller');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization){
        return res.status(401).send({ error: 'You muse be logged in.' });
    }

    const token = authorization.replace('Bearer', '');
    jwt.verify(token, 'SECRET_KEY', async (err, payload) => {
        if(err){
            return res.status(401).send({ error: 'You must be logged in.' });
        }

        const { sellerId } = payload;
        const seller = await Seller.findById(sellerId);
        req.seller = seller;
        next();
    })

}