const express = require('express');
const router = express.Router();
const db = require('../../data/db');
const { isAdmin } = require('../../middleware/auth');

const multer = require('multer');
const path = require('path');

// 1. Inställningar för Multer (sparar i mappen categories)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/categories/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cat-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// LISTA (Hämta från riktiga databasen istället för fakeCategories)
router.get('/', (req, res) => {
    const allCategories = db.prepare("SELECT * FROM categories").all();
    res.render('admin/categories', { 
        title: 'Kategorier',
        categories: allCategories, 
        activePage: 'categories'
    });
});

// VISA FORMULÄR
router.get('/new', (req, res) => {
    res.render('admin/categories-new', { 
        title: 'Ny kategori',
        activePage: 'categories'
    });
});

// SPARA KATEGORI (POST)
router.post('/new', upload.single('image'), (req, res) => {
    try {
        const { name } = req.body;
        // Skapa URL-sökvägen som sparas i DB
        const imagePath = req.file ? 'images/categories/' + req.file.filename : 'images/categories/placeholder.png';

        const sql = "INSERT INTO categories (name, image) VALUES (?, ?)";
        db.prepare(sql).run(name, imagePath);

        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send("Kunde inte spara kategorin");
    }
});

module.exports = router;