const express = require('express');
const router = express.Router();
const db = require('../../data/db');
const { isAdmin } = require('../../middleware/auth');

const multer = require('multer');
const path = require('path'); // Behövs för att hantera filändelser

// 1. Konfigurera hur och var filerna ska sparas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/products/');
    },
    filename: (req, file, cb) => {
        // Skapar ett unikt namn: t.ex. image-1714472000-12345.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Skapa upload-objektet med den nya konfigurationen
const upload = multer({ storage: storage });

// 1. LISTA ALLA PRODUKTER (Admin-vyn)
router.get('/', (req, res) => {
    try {
        const allProducts = db.prepare("SELECT * FROM products WHERE isDeleted = 0").all();

        res.render('admin/products', {
            products: allProducts,
            title: 'Administration - Produkter',
            activePage: 'products'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Kunde inte ladda produkter");
    }
});

// 2. VISA FORMULÄR FÖR NY PRODUKT
router.get('/new', (req, res) => {
    try {
        // Vi hämtar kategorier för att fylla drop-down menyn
        const categories = db.prepare("SELECT * FROM categories").all();

        res.render('admin/products-new', { 
            title: 'Lägg till produkt',
            categories: categories,
            activePage: 'products'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fel vid laddning av formulär");
    }
});

// 3. SPARA NY PRODUKT (POST)
router.post('/new', upload.single('image'), (req, res) => {
    try {
        // Hämta data från formuläret (se till att namnen matchar 'name' i din HTML)
        const { name, sku, price, categoryId, brand, description } = req.body;

        const slug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

        const imageName = req.file ? 'images/products/' + req.file.filename : 'images/products/placeholder.png';

        const sql = `
            INSERT INTO products (name, slug, sku, price, categoryId, brand, image, isDeleted, isPopular) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)
        `;

        db.prepare(sql).run(name, slug, sku, price, categoryId, brand, imageName);
        
        // Efter att produkten sparats, skicka tillbaka till listan
        res.redirect('/admin/products');
    } catch (err) {
        console.error("Kunde inte spara produkten:", err);
        res.status(500).send("Ett fel uppstod när produkten skulle sparas.");
    }
});

// 4. RADERA PRODUKT (SOFT DELETE)
router.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.prepare("UPDATE products SET isDeleted = 1 WHERE id = ?").run(id);
    res.redirect('/admin/products');
});

module.exports = router;
