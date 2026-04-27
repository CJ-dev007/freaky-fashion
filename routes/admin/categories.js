const express = require('express');
const router = express.Router();
const db = require('../../data/db');
const { isAdmin } = require('../../middleware/auth');

router.get('/', (req, res) => {
    // Vi skapar en tillfällig lista med kategorier
    const fakeCategories = [
        { id: 1, name: 'Kläder' },
        { id: 2, name: 'Accessoarer' },
        { id: 3, name: 'Skor' }
    ];

    res.render('admin/categories', { 
        title: 'Kategorier',
        categories: fakeCategories, // Nu finns listan här för EJS att använda!
        activePage: 'categories'
    });
});

router.get('/new', (req, res) => {
    res.render('admin/categories-new', { 
        title: 'Ny kategori',
        activePage: 'categories'
    });
});



module.exports = router;