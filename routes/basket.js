const express = require('express');
const router = express.Router();
const popularProducts = require('../data/products');

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

router.get('/', (req, res) => {
    const basketIds = req.session.basket || [];
    const counts = {};
    
    // 1. Räkna förekomster av varje ID
    basketIds.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
    });

    const uniqueIds = Object.keys(counts);
    let totalSum = 0; // Nollställ summan inför varje rendering
    const basketProducts = [];

    uniqueIds.forEach(id => {
        // Hitta produkten i din lista (popularProducts)
        const product = popularProducts.find(p => p.id.toString() === id.toString());
        
        if (product) {
            const quantity = counts[id];
            const rowTotal = product.price * quantity; // Pris för just denna rad
            
            // 2. ADDERA till den totala summan för hela varukorgen
            totalSum += rowTotal; 

            basketProducts.push({
                ...product,
                quantity: quantity,
                rowTotal: rowTotal
            });
        }
    });

    res.render('basket', { 
        title: 'Varukorgen',
        basketProducts: basketProducts,
        totalSum: totalSum // Skicka med den ackumulerade summan
    });
});



router.post('/add', (req, res) => {
    const { productId } = req.body;

    if (!req.session.basket) {
        req.session.basket = [];
    }

    // Lägg till produktens ID i varukorgs-arrayen
    req.session.basket.push(productId);

    res.json({ success: true, basketCount: req.session.basket.length });
});

router.post('/remove/:id', (req, res) => {
    const idToRemove = req.params.id;
    
    if (req.session.basket) {
        // Filtrera bort alla produkter som har detta ID
        req.session.basket = req.session.basket.filter(id => id.toString() !== idToRemove.toString());
    }
    
    res.redirect('/basket');
});

router.post('/update-qty', (req, res) => {
    const { id, qty } = req.body; // Hämtar id och nya antalet från scriptet
    const newQty = parseInt(qty);

    if (req.session.basket) {
        // 1. Ta bort alla gamla förekomster av just denna produkt
        req.session.basket = req.session.basket.filter(productId => productId.toString() !== id.toString());

        // 2. Lägg till produkten igen exakt så många gånger som användaren valt
        for (let i = 0; i < newQty; i++) {
            req.session.basket.push(id.toString());
        }
    }

    // Skicka svar tillbaka till scriptet så att det kan köra window.location.reload()
    res.json({ success: true });
});


module.exports = router;