const express = require('express');
const router = express.Router();
const popularProducts = require('../data/products');


router.get('/klader', (req, res) => {
    // Vi plockar ut bara de som INTE är populära (alltså dina hoodies)
    const categoryProducts = popularProducts.filter(p => p.isPopular === false);

    res.render('categories', { 
        title: 'Kläder', 
        products: categoryProducts 
    });
});

module.exports = router;
