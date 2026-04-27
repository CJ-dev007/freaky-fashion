const express = require('express');
const router = express.Router();
const popularProducts = require('../data/products'); 

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

router.get('/', function(req, res,) {
  const userFavorites = req.session.favorites || [];
  const favoriteProducts = popularProducts
  .filter(product => userFavorites.includes(product.id.toString()))
    .map(product => {
      return {
        ...product,
        isFavorite: true // De är ju i favoritlistan, så de ska alltid vara true här
      };
    });

  res.render('favorites', { 
    title: 'Mina favoriter',
    products: favoriteProducts
  });
});

router.post('/toggle/:id', (req, res) => {
    const productId = req.params.id;

    // Skapa favoritlistan i sessionen om den inte finns än
    if (!req.session.favorites) {
        req.session.favorites = [];
    }

    const index = req.session.favorites.indexOf(productId);

    if (index > -1) {
        // Om ID redan finns: ta bort det (un-favorite)
        req.session.favorites.splice(index, 1);
    } else {
        // Om ID inte finns: lägg till det
        req.session.favorites.push(productId);
    }

    res.json({ success: true, count: req.session.favorites.length });
});

module.exports = router;