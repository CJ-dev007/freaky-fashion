const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/login', function(req, res,) {
  res.render('login', { title: 'Logga in', errorMessage: null });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

        if (user && user.password === password) {
            req.session.isLoggedIn = true;
            req.session.user = { 
                id: user.id, 
                username: user.username, 
                admin: user.admin 
            };
            
            req.session.showWelcome = true; 

            return user.admin === 1 ? res.redirect('/admin/products') : res.redirect('/');
        } else {
            res.render('login', { title: 'Logga in', errorMessage: 'Fel uppgifter' });
        }
    } catch (err) {
        res.render('login', { title: 'Logga in', errorMessage: 'Ett fel uppstod' });
    }
});


router.post('/register', (req, res) => {
    const { email, password } = req.body;
    console.log(`Registrerar: ${email}`)

     try {      
        const info = db.prepare("INSERT INTO users (username, password, email, admin) VALUES (?, ?, ?, ?)")
                       .run(email, password, email, 0); 

        console.log("Användare skapad med ID:", info.lastInsertRowid);
        
        res.redirect('/login');

    } catch (err) {
        console.error("Kunde inte spara användare:", err);
        
        res.render('register', { 
            title: 'Registrera konto', 
            errorMessage: 'E-posten är redan registrerad.' 
        });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Kunde inte logga ut:", err);
        }
        res.redirect('/'); 
    });
});

module.exports = router;