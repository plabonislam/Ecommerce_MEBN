var express = require('express');
var router = express.Router();
var passport=require('passport');
var csrf = require('csurf');//import csurf in csrf variable
var Product=require('../models/product');
var Cart=require('../models/cart');

var csrfProtection=csrf();//csurfProtection variable using csurf pacakage
router.use(csrfProtection);//all routes uses this csurf protection
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

router.get('/add-cart/:id', function(req, res, next) {
var productid=req.params.id;
//create a cart object
var cart=new Cart(req.session.cart ? req.session.cart :{ items:{}});
Product.findById(productid,function(err,product)
{
  if(err){
    return res.redirect('/');
  }
  cart.add(product,product.id);
  req.session.cart=cart;//store cart to session
 console.log(req.session.cart);
  res.redirect('/');

});
});
 module.exports = router;

