const express = require('express');
const router = express.Router();

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

// GET http://localhost:3000/
router.get('/', function(req, res, next) {
 
  const products = [
        { id: 1, name: "Lorem Ipsum dolor", image: "https://placehold.co/300x200" },
        { id: 2, name: "Lorem Ipsum dolor", image: "https://placehold.co/300x200" },
        { id: 3, name: "Lorem Ipsum dolor", image: "https://placehold.co/300x200" }
    ];

  res.render('index', {
    title: 'FreakyFashion',
    heroTitle: "Lorem ipsum dolor", 
    heroText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    spots: products
  });
});




module.exports = router;


