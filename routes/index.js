const express = require('express');
const router = express.Router();

// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

 const spots = [
        { id: 1, name: "Detaljerna som Gör Det", image: "images/spots6.avif" },
        { id: 2, name: "Livet är bättre i flip-flops", image: "images/spots9.avif" },
        { id: 3, name: "Mest Populära Just Nu", image: "images/spots4.avif" }
    ];

  const popularProducts = [
    { id: 1, name: "Svart T-shirt", slug: "svart-tshirt-1", price: 199, brand: "Levis", image: "images/tshirt1.avif", isNew: true },
    { id: 2, name: "Svart T-shirt", slug: "svart-tshirt-2", price: 199, brand: "Levis", image: "images/tshirt2.avif", isNew: true },
    { id: 3, name: "Svart T-shirt", slug: "svart-tshirt-3", price: 199, brand: "Levis", image: "images/tshirt3.avif", isNew: true },
    { id: 4, name: "Svart T-shirt", slug: "svart-tshirt-4", price: 199, brand: "Levis", image: "images/tshirt4.avif", isNew: true },
    { id: 5, name: "Svart T-shirt", slug: "svart-tshirt-5", price: 199, brand: "Levis", image: "images/tshirt5.avif", isNew: true },
    { id: 6, name: "Svart T-shirt", slug: "svart-tshirt-6", price: 199, brand: "Levis", image: "images/tshirt6.avif", isNew: true },
    { id: 7, name: "Svart T-shirt", slug: "svart-tshirt-7", price: 199, brand: "Levis", image: "images/tshirt7.avif", isNew: true },
    { id: 8, name: "Svart T-shirt", slug: "svart-tshirt-8", price: 199, brand: "Levis", image: "images/tshirt8.avif", isNew: true }
  ]

// GET http://localhost:3000/
router.get('/', function(req, res, next) {
  const userFavorites = req.session.favorites || [];

  // Mappa om produkterna så att "isFavorite" stämmer överens med sessionen
    const productsWithFavorites = popularProducts.map(product => {
        return {
            ...product,
            isFavorite: userFavorites.includes(product.id.toString())
        };
    });
 
   res.render('index', {
    title: 'Freaky Fashion',
    heroTitle: "Wild Spirit, Freaky Soul", 
    heroText: "Sommarens mest eftertraktade prints är här. Maxa din festival-look med grafiska tees som sticker ut i mängden.",
    heroImage: "images/hero.avif",
    spots: spots,
    products: popularProducts
  });
});

router.get('/favorites', function(req, res,) {
  const userFavorites = req.session.favorites || [];
  const favoriteProducts = popularProducts.filter(product =>
    userFavorites.includes(product.id.toString())
  );

  res.render('favorites', { 
    title: 'Mina favoriter',
    products: favoriteProducts
  });
});

router.get('/basket', function(req, res,) {
  res.render('basket', { title: 'Varukorg' });
});

router.get('/login', function(req, res,) {
  res.render('login', { title: 'Logga in' });
});

router.get('/search', (req, res) => {
    // 1. Hämta sökordet från URL:en (q kommer från name="q" i din input)
    const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';

    // 2. Filtrera produkterna (vi kollar om namnet innehåller sökordet)
    const searchResults = popularProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );

    // 3. Rendera sökresultat-sidan och skicka med resultaten
    res.render('search', { 
        title: 'Sökresultat', 
        products: searchResults, 
        searchTerm: req.query.q // Skicka med originalordet för att visa "Resultat för '...'"
    });
});

// RUTT FÖR PRODUKTDETALJER
router.get('/products/:slug', (req, res) => {
    // 1. Hämta id från URL:en och gör om till ett nummer
    const productSlug = req.params.slug;
    const product = popularProducts.find(p => p.slug === productSlug);
 
    if (product) {
        // Kontrollera om denna specifika produkt är en favorit i sessionen
        const userFavorites = req.session.favorites || [];
        product.isFavorite = userFavorites.includes(product.id.toString());
        
        res.render('productDetail', { 
            title: product.name, 
            product: product 
        });
    } else {
        res.status(404).send('Produkten hittades tyvärr inte');
    }
});

router.post('/favorites/toggle/:id', (req, res) => {
    const productId = req.params.id;

    // Skapa favoritlistan i sessionen om den inte finns än
    if (!req.session.favorites) {
        req.session.favorites = [];
    }

    const index = req.session.favorites.indexOf(productId);

    if (index > -1) {
        // Om ID redan finns: ta bort det (un-favorite)
        req.session.favorites.splice(index, 1);
    } else {
        // Om ID inte finns: lägg till det
        req.session.favorites.push(productId);
    }

    res.json({ success: true, count: req.session.favorites.length });
});


module.exports = router;


