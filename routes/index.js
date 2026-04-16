const express = require('express');
const router = express.Router();

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

// GET http://localhost:3000/
router.get('/', function(req, res, next) {
 
  const spots = [
        { id: 1, name: "Detaljerna som Gör Det", image: "images/spots6.avif" },
        { id: 2, name: "Livet är bättre i flip-flops", image: "images/spots9.avif" },
        { id: 3, name: "Mest Populära Just Nu", image: "images/spots4.avif" }
    ];

  const popularProducts = [
    { id: 1, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt1.avif", isNew: true, isFavorite: false },
    { id: 2, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt2.avif", isNew: true, isFavorite: false },
    { id: 3, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt3.avif", isNew: true, isFavorite: false },
    { id: 4, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt4.avif", isNew: true, isFavorite: false },
    { id: 5, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt5.avif", isNew: true, isFavorite: false },
    { id: 6, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt6.avif", isNew: true, isFavorite: false },
    { id: 7, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt7.avif", isNew: true, isFavorite: false },
    { id: 8, name: "Svart T-shirt", price: 199, brand: "Levis", image: "images/tshirt8.avif", isNew: true, isFavorite: false }
  ]

  res.render('index', {
    title: 'Freaky Fashion',
    heroTitle: "Wild Spirit, Freaky Soul", 
    heroText: "Sommarens mest eftertraktade prints är här. Maxa din festival-look med grafiska tees som sticker ut i mängden.",
    heroImage: "images/hero.avif",
    spots: spots,
    products: popularProducts
  });
});




module.exports = router;


