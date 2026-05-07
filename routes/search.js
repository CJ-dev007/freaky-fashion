const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/', (req, res) => {
    const searchTerm = req.query.q || ''; // Hämtar det användaren skrev i sökfältet

    // Sök i databasen efter produkter som matchar namnet
    // Vi använder % för att hitta ordet även om det bara är en del av namnet
    const products = db.prepare("SELECT * FROM products WHERE name LIKE ? AND isDeleted = 0").all(`%${searchTerm}%`);

    // Kolla favoriter 
    const userFavorites = req.session.favorites || [];
    const productsWithStatus = products.map(product => ({
        ...product,
        isFavorite: userFavorites.includes(product.id.toString())
    }));

    // Skicka med produkterna OCH antalet (products.length) till EJS
    res.render('search', {
        title: 'Sökresultat',
        products: productsWithStatus,
        count: products.length,
        searchTerm: searchTerm
    });
});

module.exports = router;