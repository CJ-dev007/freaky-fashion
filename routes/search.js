const express = require('express');
const router = express.Router();
const popularProducts = require('../data/products'); 

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

router.get('/', (req, res) => {
    // 1. Hämta sökordet från URL:en (q kommer från name="q" i din input)
    const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';

    // 2. Filtrera produkterna (vi kollar om namnet innehåller sökordet)
    const searchResults = popularProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );

    // 3. Rendera sökresultat-sidan och skicka med resultaten
    res.render('search', { 
        title: 'Sökresultat', 
        products: searchResults, 
        searchTerm: req.query.q // Skicka med originalordet för att visa "Resultat för '...'"
    });
});

module.exports = router;