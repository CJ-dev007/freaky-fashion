const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/', (req, res) => {
    const userFavorites = req.session.favorites || [];

    const newsProducts = db.prepare("SELECT * FROM products WHERE createdAt >= date('now', '-7 days') AND isDeleted != 1").all();

    const productsWithFavorites = newsProducts.map(product => {
        return {
            ...product,
            isFavorite: userFavorites.includes(product.id.toString())
        };
    });

    res.render('news', {
        title: 'Nyheter',
        products: productsWithFavorites
    });
});


module.exports = router;
