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
var cors = require('express-cors')
 
app.use(cors({
    allowedOrigins: [
        '127.0.0.1:8080'
    ]
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.all('*', function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");//前端域名
  res.header("Access-Control-Allow-Credentials",'true');
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});


/* session配置 */
app.use(session({
  secret: 'aaaa',
  name:'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
  cookie:{
    maxAge:1000 * 60 * 60
  }
  
}))



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/goods', goodsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/site', siteRouter);
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
