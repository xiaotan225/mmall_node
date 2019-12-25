var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var cartRouter = require('./routes/cart');
var siteRouter = require('./routes/site');
var app = express();

var { Mongoose } = require('./util/config')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.all('*', function (req, res, next) {

//   res.header("Access-Control-Allow-Origin", "*");//项目上线后改成页面的地址

//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

//   next();

// });

/* sesssion配置 */
app.use(session({
  secret: 'aaaa',
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}))




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);
app.use('/cart', cartRouter);
app.use('/site', siteRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
Mongoose.connect()
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
