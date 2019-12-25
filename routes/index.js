var express = require('express');
var router = express.Router();
var moment = require('moment')
require('moment/locale/zh-cn')
/* GET home page. */
router.get('/', function(req, res, next) {
  let title =moment().format('MMMM Do YYYY, h:mm: a'); ;
  res.render('index', { title: title });
});

module.exports = router;
