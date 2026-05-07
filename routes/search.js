const express = require('express');
const router = express.Router();

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

router.get('/', (req, res) => {
    const searchTerm = req.query.q || ''; // Hämtar det användaren skrev i sökfältet

    // 1. Sök i databasen efter produkter som matchar namnet
    // Vi använder % för att hitta ordet även om det bara är en del av namnet
    const products = db.prepare("SELECT * FROM products WHERE name LIKE ? AND isDeleted = 0").all(`%${searchTerm}%`);

    // 2. Kolla favoriter (valfritt, men bra för hjärt-ikonen)
    const userFavorites = req.session.favorites || [];
    const productsWithStatus = products.map(product => ({
        ...product,
        isFavorite: userFavorites.includes(product.id.toString())
    }));

    // 3. Skicka med produkterna OCH antalet (products.length) till EJS
    res.render('search', {
        title: 'Sökresultat',
        products: productsWithStatus,
        count: products.length,
        searchTerm: searchTerm
    });
});

module.exports = router;