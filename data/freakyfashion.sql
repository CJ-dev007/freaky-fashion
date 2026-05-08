CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  brand TEXT, 
  image TEXT,
  isNew INTEGER DEFAULT 0,
  isPopular INTEGER DEFAULT 0
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, 
  email TEXT,
  admin INTEGER DEFAULT 0
);

INSERT INTO users (username, password, email, admin) 
VALUES ('admin', '1234', 'admin@freakyfashion.se', 1);