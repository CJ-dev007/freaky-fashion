const express = require('express');
const router = express.Router();

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

router.get('/login', function(req, res,) {
  res.render('login', { title: 'Logga in' });
});


router.get('/register', (req, res) => {
    res.render('register', { title: 'Registrera konto' });
});

router.post('/register', (req, res) => {
    const { email, password } = req.body;
    console.log(`Registrerar: ${email}`)

    res.redirect('/');
})


module.exports = router;