const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session'); 

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'hemligt-valfritt-ord',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Sätt till false eftersom du kör lokalt (inte https)
}));

app.use('/admin/products', adminProductsRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin', adminRouter);

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/basket', basketRouter);
app.use('/', authRouter);
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
