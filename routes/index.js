var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/shop', {useNewUrlParser: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index', { title: 'Shopping Cart' });
});

module.exports = router;
