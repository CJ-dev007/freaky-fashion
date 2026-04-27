const express = require('express');
const router = express.Router();
const popularProducts = require('../data/products'); 

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

 const spots = [
        { id: 1, name: "Detaljerna som Gör Det", image: "images/spots6.avif" },
        { id: 2, name: "Livet är bättre i flip-flops", image: "images/spots9.avif" },
        { id: 3, name: "Mest Populära Just Nu", image: "images/spots4.avif" }
    ];

  

// GET http://localhost:3000/
router.get('/', function(req, res, next) {

    req.session.user = { admin: 1, name: 'Admin Test' };

  const userFavorites = req.session.favorites || [];

 // 1. FILTRERA: Hämta bara de som är markerade som isPopular: true
  const onlyPopular = popularProducts.filter(p => p.isPopular === true);

  // 2. MAPPA: Använd den filtrerade listan (onlyPopular) istället för hela listan
  const productsWithFavorites = onlyPopular.map(product => {
      return {
          ...product,
          isFavorite: userFavorites.includes(product.id.toString())
      };
  });
 
   res.render('index', {
    title: 'Freaky Fashion',
    heroTitle: "Wild Spirit, Freaky Soul", 
    heroText: "Sommarens mest eftertraktade prints är här. Maxa din festival-look med grafiska plagg som sticker ut i mängden.",
    heroImage: "images/hero.avif",
    spots: spots,
    products: productsWithFavorites
  });
});



router.get('/checkout', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: sans-serif; padding: 50px;">
            <h1>Kassan</h1>
            <p>Detta är en demo-vy av kassan.</p>
            <img src="/images/kassademo.png" alt="Kassan" style="max-width: 800px; width: 100%; border: 1px solid #000;">
            <br><br>
            <a href="/" style="color: black;">Tillbaka till butiken</a>
        </div>
    `);        
})




module.exports = router;


