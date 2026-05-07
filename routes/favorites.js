const express = require('express');
const router = express.Router();

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

router.get('/', function(req, res) {
  const userFavorites = req.session.favorites || [];

  // Om inga favoriter finns, skicka en tom lista direkt till ejs
  if (userFavorites.length === 0) {
    return res.render('favorites', { 
      title: 'Mina favoriter',
      products: [] 
    });
  }

  // Hämta favoriterna från databasen istället för den gamla filen
  const placeholders = userFavorites.map(() => '?').join(',');
  const favoriteProducts = db.prepare(`
    SELECT * FROM products 
    WHERE id IN (${placeholders}) AND isDeleted != 1
  `).all(...userFavorites);

  // Vi lägger på isFavorite: true så att EJS vet att hjärtat ska vara rött
  const productsWithStatus = favoriteProducts.map(product => ({
    ...product,
    isFavorite: true
  }));

  res.render('favorites', { title: 'Mina favoriter', products: productsWithStatus });
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