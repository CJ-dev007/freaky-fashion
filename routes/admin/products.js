const express = require('express');
const router = express.Router();
// Vi hämtar produkterna direkt från din JS-fil istället för databasen
const popularProducts = require('../../data/products'); 
const { isAdmin } = require('../../middleware/auth');

// GET /admin/products
router.get('/', (req, res) => {
    // Vi skickar med din lista från data/products.js
    res.render('admin/products', { 
        products: popularProducts, 
        title: 'Administration - Produkter',
        activePage: 'products' 
    });
});

// En enkel route för "Ny produkt" så att sidan inte kraschar
router.get('/new', (req, res) => {
    res.render('admin/products-new', { title: 'Lägg till produkt' });
});

module.exports = router;
