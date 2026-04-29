const express = require('express');
const router = express.Router();


// Importera db-objektet - vi behöver detta för att kommunicera med databasen
const db = require('../data/db');

 const spots = [
        { id: 1, name: "Detaljerna som Gör Det", image: "images/spots6.avif", url: "/spots/details" },
        { id: 2, name: "Livet är bättre i flip-flops", image: "images/spots9.avif", url: "/spots/flipflops" },
        { id: 3, name: "Mest Populära Just Nu", image: "images/spots4.avif", url: "/spots/popular" }
    ];

// 1. Detaljerna
router.get('/spots/details', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: 'Comic Sans MS', sans-serif; padding: 50px; background-color: #f9f9f9;">
            <h1>Detaljerna som Gör Det 🕶️</h1>
            <p>Det är de små sakerna som räknas. Som en matchande fluga till pälsen.</p>
            <img src="/images/detalj1.png" style="max-width: 500px; border-radius: 20px; box-shadow: 20px 20px 0px #bae0f7;">
            <br><br>
            <a href="/" style="font-weight: bold; font-size: 20; color: black;">Hoppa tillbaka till shoppen</a>
        </div>
    `);
});

// 2. Flip-flops
router.get('/spots/flipflops', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: sans-serif; padding: 50px; background-color: #fff4e6;">
            <h1>Livet är bättre i flip-flops 🩴</h1>
            <p>Varning: Ej rekommenderat för halkrisk, men 100% stilpoäng.</p>
            <img src="/images/flipflops1.png" style="max-width: 500px; transform: rotate(3deg); border: 5px solid white;">
            <br><br>
            <a href="/" style="background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Tillbaka till värmen</a>
        </div>
    `);
});

// 3. Populärt just nu
router.get('/spots/popular', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: sans-serif; padding: 50px; background-color: #e3f2fd;">
            <h1>Mest Populära Just Nu 🔥</h1>
            <p>Alla ville ha det. Nu finns bara smulor kvar (och den här arga hamstern).</p>
            <img src="/images/popular1.png" style="max-width: 500px;">     
            <br><br>
            <a href="/" style="color: #1976d2; font-size: 18;">Försök igen imorgon</a>
        </div>
    `);
});

// Accessoarer - Humor-sida
router.get('/funny/accessories', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: 'Courier New', monospace; padding: 50px; background-color: #f0f0f0;">
            <h1 style="text-transform: uppercase; letter-spacing: 5px;">Trend-larm: Maxat är det nya svarta 💍</h1>
            <p>Varför välja en stil när man kan ha alla? Vi kallar denna look för "Allt-på-en-gång-chic".</p>
            <img src="/images/accessoarer1.png" style="max-width: 500px; border: 10px solid green; filter: saturate(150%);">
            <p><i>Modellen på bilden bär 42 kg smycken. Don't try this at home utan nackspärrsförsäkring.</i></p>
            <br>
            <a href="/" style="color: gold; background: black; padding: 15px; text-decoration: none;">TA MIG TILL SÄKRARE SMYCKEN</a>
        </div>
    `);
});

// Skor - Humor-sida
router.get('/funny/shoes', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: 'Comic Sans MS', sans-serif; padding: 50px; background-color: rgb(250, 242, 169);">
            <h1>Röda mattan? Nej, röda gummistövlar! 👢 </h1>
            <p>När det regnar i Göteborg men du ändå ska på gala. 100% vattentät, 0% andningsförmåga.</p>
            <img src="/images/shoes.png" style="max-width: 600px; width: 100%; border-radius: 300px 300px 0 0; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <br><br>
            <a href="/" style="color: #8d6e63; font-weight: bold; border: 2px dashed #8d6e63; padding: 10px;">GÅ TILLBAKA (INNAN DU BLIR HUNGRIG)</a>
        </div>
    `);
});

  

// GET http://localhost:3000/
router.get('/', function(req, res, next) {

    req.session.user = { admin: 1, name: 'Admin Test' };

  const userFavorites = req.session.favorites || [];

  const onlyPopularFromDb = db.prepare("SELECT * FROM products WHERE isPopular =1").all();

  const productsWithFavorites = onlyPopularFromDb.map(product => {
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


