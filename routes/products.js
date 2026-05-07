const express = require('express');
const router = express.Router();

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

router.get('/:slug', (req, res) => {
    const productSlug = req.params.slug;

    // 1. Hämta produkten från databasen med hjälp av slug
    const product = db.prepare("SELECT * FROM products WHERE slug = ? AND isDeleted != 1").get(productSlug);
 
    if (product) {
        // 2. Kontrollera favoriter
        const userFavorites = req.session.favorites || [];
        product.isFavorite = userFavorites.includes(product.id.toString());

        // 3. Hämta relaterade produkter från databasen (t.ex. 6 slumpmässiga eller de senaste)
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