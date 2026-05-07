const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/:slug', (req, res) => {
    const productSlug = req.params.slug;

    // Hämta produkten från databasen med hjälp av slug
    const product = db.prepare("SELECT * FROM products WHERE slug = ? AND isDeleted != 1").get(productSlug);
 
    if (product) {
        // Kontrollera favoriter
        const userFavorites = req.session.favorites || [];
        product.isFavorite = userFavorites.includes(product.id.toString());

        // Hämta relaterade produkter från databasen (6 slumpmässiga)
        // Vi exkluderar den nuvarande produkten så den inte dyker upp som relaterad till sig själv
        const relatedProducts = db.prepare(`
            SELECT * FROM products 
            WHERE slug != ? AND isDeleted != 1 
            LIMIT 6
        `).all(productSlug);
        
        res.render('productDetail', { 
            title: product.name, 
            product: product,
            relatedProducts: relatedProducts
        });
    } else {
        res.status(404).send('Produkten hittades tyvärr inte');
    }
});

module.exports = router;