const express = require('express');
const router = express.Router();
const popularProducts = require('../data/products'); 

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

// RUTT FÖR PRODUKTDETALJER
router.get('/:slug', (req, res) => {
    // 1. Hämta id från URL:en och gör om till ett nummer
    const productSlug = req.params.slug;
    const product = popularProducts.find(p => p.slug === productSlug);
 
    if (product) {
        // Kontrollera om denna specifika produkt är en favorit i sessionen
        const userFavorites = req.session.favorites || [];
        product.isFavorite = userFavorites.includes(product.id.toString());

        const relatedProducts = popularProducts
            .filter(p => p.slug !== productSlug)
            .slice(0, 6);
        
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