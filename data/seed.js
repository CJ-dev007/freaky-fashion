const db = require('./db');
const products = require('./products');

// Skapa tabellen om den inte redan finns
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    brand TEXT,
    image TEXT,
    isNew INTEGER DEFAULT 0,
    isPopular INTEGER DEFAULT 0
  );
`);

// Förbered för att lägga in data
const insert = db.prepare(`
    INSERT INTO products (name, slug, price, brand, image, isNew, isPopular) 
    VALUES (@name, @slug, @price, @brand, @image, @isNew, @isPopular)
`);

// Kör loopen
for (const p of products) {
    insert.run({
        name: p.name,
        slug: p.slug,
        price: p.price,
        brand: p.brand,
        image: p.image,
        isNew: p.isNew ? 1 : 0,
        isPopular: p.isPopular ? 1 : 0
    });
}

console.log("Tabellen skapad och datan är nu på plats!");

