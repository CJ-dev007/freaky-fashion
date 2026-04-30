const express = require('express');
const router = express.Router();
const db = require('../data/db'); 

router.get('/klader', (req, res) => {
    try {
        // 1. Hämta kategorins namn (förutsatt att 'Kläder' har id 1)
        const category = db.prepare("SELECT name FROM categories WHERE id = ?").get(1);

        // 2. Hämta bara Hoodies som tillhör kategori 1 och INTE är raderade
        const categoryProducts = db.prepare("SELECT * FROM products WHERE categoryId = 1 AND name LIKE '%Hoodie%' AND isDeleted = 0").all();

        // 3. Rendera sidan
        res.render('categories', {
            title: category ? category.name : 'Kläder',
            products: categoryProducts
        });
    } catch (err) {
        console.error("Fel vid hämtning av kategoriprodukter:", err);
        res.status(500).send("Ett fel uppstod på servern");
    }
});

module.exports = router;

