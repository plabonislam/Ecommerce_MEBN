var express = require('express');
var router = express.Router();
var Product=require('../models/product');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/shop', {useNewUrlParser: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  //want to grab seed data from data base...as asynchronise data retriving
  Product.find(function(err,docs)
  {
    var chunk=[];
    var chunksize=3;
    for(var i=0;i<docs.length;i+=chunksize)
    {
      chunk.push(docs.slice(i,i+chunksize));
    }
    res.render('shop/index', { title: 'Shopping Cart',products: chunk });
  });
  
});

module.exports = router;
