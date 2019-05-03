var express = require('express');
var router = express.Router();
var passport=require('passport');
//var csrf = require('csurf');//import csurf in csrf variable
var Product=require('../models/product');
var Cart=require('../models/cart');

//var csrfProtection=csrf();//csurfProtection variable using csurf pacakage
//router.use(csrfProtection);//all routes uses this csurf protection
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
    var succ=req.flash('success')[0];
    res.render('shop/index', { title: 'Shopping Cart',products: chunk,success:succ,nosuccess:!succ });
  });
  
});

router.get('/add-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  //create an object
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
     if (err) {
         return res.redirect('/');
     }
      cart.add(product, product.id);
      req.session.cart = cart;//store cart to session
 console.log(req.session.cart);
  res.redirect('/');

});
});


router.get('/shoppingcart', function(req, res, next) {
  if (!req.session.cart) {
      return res.render('shop/shoppingcart', {products: null});
  } 
   var cart = new Cart(req.session.cart);
   res.render('shop/shoppingcart', {products: cart.generateArray(), totalprice: cart.totalPrice});
});

router.get('/checkout', isLoggedin ,function(req,res,next)
{
  if(!req.session.cart){
    return res.render('/shoppingcart');
  }
  
  var cart=new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
// if erro is null then !errmsg return false
  res.render('shop/checkout',{totalprice:cart.totalPrice,errMsg: errMsg, noError: !errMsg});

});


router.post('/checkout', isLoggedin ,function(req,res,next)
{
  if(!req.session.cart){
    return res.redirect('/shoppingcart');
  }
  var cart = new Cart(req.session.cart);
    
  var stripe = require("stripe")(
      "sk_test_rjyjDXeaF4ZtqdpjVwrmBysT00PsodNFrW"
  );

  stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge"
  }, function(err, charge) {
      if (err) {
          req.flash('error', err.message);
          return res.redirect('/checkout');
      }
      req.flash('success', 'Successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
});
});


module.exports = router;

function isLoggedin(req,res,next)
 {
   if(req.isAuthenticated())
   {
     return next();
   }
   req.session.oldurl=req.url;
   console.log(req.session.oldurl);
   res.redirect('/user/signin');
 }
