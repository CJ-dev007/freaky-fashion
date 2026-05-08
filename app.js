const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const db = require('./data/db');  

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const basketRouter = require('./routes/basket');
const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');
const favoritesRouter = require('./routes/favorites');
const categoriesRouter = require('./routes/categories');
const newsRouter = require('./routes/news');

const adminProductsRouter = require('./routes/admin/products');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminRouter = require('./routes/admin/admin');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'hemligt-valfritt-ord',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Sätt till false eftersom du kör lokalt (inte https)
}));

const isAdmin = (req, res, next) => {
        if (req.session.isLoggedIn && req.session.user && req.session.user.admin === 1) {
        return next(); 
    }
      res.redirect('/login'); 
};

// Middleware som hämtar kategorier till menyn på VARJE sida
app.use((req, res, next) => {
    try {
        const menuCategories = db.prepare("SELECT * FROM categories").all();
        // res.locals gör att variabeln finns tillgänglig i ALLA .ejs-filer automatiskt
        res.locals.menuCategories = menuCategories;
    } catch (err) {
        console.error("Kunde inte ladda menyn:", err);
        res.locals.menuCategories = []; // Skicka tom lista om det skiter sig
    }
    next();
});

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user = req.session.user || null;
    if (req.session.showWelcome) {
        res.locals.welcomeMessage = `Välkommen tillbaka, ${req.session.user.username}!`;
        delete req.session.showWelcome; 
    } else {
        res.locals.welcomeMessage = null;
    }
    next();
});

app.use('/admin/products', isAdmin, adminProductsRouter);
app.use('/admin/categories', isAdmin, adminCategoriesRouter);
app.use('/admin', isAdmin, adminRouter);

app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/basket', basketRouter);
app.use('/search', searchRouter);
app.use('/favorites', favoritesRouter);
app.use('/categories', categoriesRouter);
app.use('/news', newsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
