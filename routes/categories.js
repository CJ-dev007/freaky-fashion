const express = require('express');
const router = express.Router();
const db = require('../data/db'); 

router.get('/klader', (req, res) => {
    try {
        // Hämta kategorins namn 
        const category = db.prepare("SELECT name FROM categories WHERE id = ?").get(1);

        // Hämta bara Hoodies som tillhör kategori 1 och INTE är raderade
        const categoryProducts = db.prepare("SELECT * FROM products WHERE categoryId = 1 AND name LIKE '%Hoodie%' AND isDeleted = 0").all();

        // Rendera sidan
        res.render('categories', {
            title: category ? category.name : 'Kläder',
            products: categoryProducts
        });
    } catch (err) {
        console.error("Fel vid hämtning av kategoriprodukter:", err);
        res.status(500).send("Ett fel uppstod på servern");
    }
});

// Lista på roliga bilder/GIFs
const surpriseGifs = [
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGlyM3VkMGc3YjdsOTkyMDFpYmFjdXdkM3ZtbHB0YnRzOWM4b2JmNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Y0ITfIXCdm8zdFm3YR/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmNwM3pmcmF0cjEwbTRycnM1czVpc3UwOGFvOTI4MGMwc3A3b24yOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0geEIktOAMxBky4dgW/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2RvNHZkdzN4M2V3OGQ5ZTZkd3ozaGo3ZTU0Z2V0aXFoOTFwcXAyZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/i34oXbluCO0G4/giphy.gif"
];

// Denna rutt fångar upp alla nya kategorier 
router.get('/:id', (req, res) => {
    const categoryId = req.params.id;
    
    // Kolla vad kategorin heter i databasen
    const category = db.prepare("SELECT name FROM categories WHERE id = ?").get(categoryId);
    const catName = category ? category.name : "Okänd trend";

    // Slumpa en bild
    const randomGif = surpriseGifs[Math.floor(Math.random() * surpriseGifs.length)];

    // Skicka ut den roliga sidan direkt
    res.send(`
        <div style="text-align: center; font-family: 'Trebuchet MS', sans-serif; padding: 50px; background-color: #ffe066; min-height: 100vh;">
            <h1 style="font-size: 3rem; text-shadow: 2px 2px #fff;">🌟 TREND-CHOCK: ${catName.toUpperCase()} 🌟</h1>
            <p style="font-size: 1.5rem;">Varning: Denna kategori är så ny att den knappt hunnit landa i lagret!</p>
            
            <img src="${randomGif}" style="max-width: 500px; border: 15px double black; margin: 20px; border-radius: 20px;">
            
            <p><i>Du ser fantastisk ut i ${catName} förresten.</i></p>
            <br><br>
            <a href="/" style="background: black; color: white; padding: 20px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 1.2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                ← TILLBAKA 
            </a>
        </div>
    `);
});


module.exports = router;

