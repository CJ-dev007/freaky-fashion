const express = require('express');
const router = express.Router();
const popularProducts = require('../data/products'); // Din array-fil

router.get('/', (req, res) => {
    const userFavorites = req.session.favorites || [];

    // Hämta alla produkter som har isNew: true
    const newsProducts = popularProducts.filter(p => p.isNew === true);

    // Mappa för att se vilka som är användarens favoriter
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
