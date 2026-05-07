const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.get('/', (req, res) => {
    const basketIds = req.session.basket || [];
    
    if (basketIds.length === 0) {
        return res.render('basket', { 
            title: 'Varukorgen',
            basketProducts: [],
            totalSum: 0 
        });
    }

    const counts = {};
    basketIds.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
    });

    const uniqueIds = Object.keys(counts);
    let totalSum = 0;
    const basketProducts = [];

    // Hämta alla unika produkter i varukorgen från databasen på en gång
    const placeholders = uniqueIds.map(() => '?').join(',');
    const productsFromDb = db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).all(...uniqueIds);

    productsFromDb.forEach(product => {
        const quantity = counts[product.id.toString()];
        const rowTotal = product.price * quantity;
        
        totalSum += rowTotal; 

        basketProducts.push({
            ...product,
            quantity: quantity,
            rowTotal: rowTotal
        });
    });

    res.render('basket', { 
        title: 'Varukorgen',
        basketProducts: basketProducts,
        totalSum: totalSum
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
        req.session.basket = req.session.basket.filter(id => id.toString() !== idToRemove.toString());
    }
    
    res.redirect('/basket');
});

router.post('/update-qty', (req, res) => {
    const { id, qty } = req.body; 
    const newQty = parseInt(qty);

    if (req.session.basket) {
        req.session.basket = req.session.basket.filter(productId => productId.toString() !== id.toString());

        // Lägg till produkten igen exakt så många gånger som användaren valt
        for (let i = 0; i < newQty; i++) {
            req.session.basket.push(id.toString());
        }
    }

    // Skicka svar tillbaka till scriptet så att det kan köra window.location.reload()
    res.json({ success: true });
});


module.exports = router;