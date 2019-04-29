var express = require('express');
var router = express.Router();
var passport=require('passport');
var csrf = require('csurf');//import csurf in csrf variable
var Product=require('../models/product');

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



router.get('/user/signup',function (req,res,next) {
   var messages=req.flash('error');
   var cond;
   if(messages.length > 0)
     cond=true;
    else
    cond=false;
  res.render('user/signup', { csrftoken : req.csrfToken(),messages:messages,hasErrors: true });
});

router.post('/user/signup',passport.authenticate('local.signup',{
  successRedirect :'/user/profile',
  failureRedirect:'/user/signup',
  failureFlash:true
 }));


 router.get('/user/signin',function (req,res,next) {
  var messages=req.flash('error');
  var cond;
  if(messages.length > 0)
    cond=true;
   else
   cond=false;
 res.render('user/signin', { csrftoken : req.csrfToken(),messages:messages,hasErrors: true });
});

router.post('/user/signin',passport.authenticate('local.signin',{
  successRedirect :'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
 }));

 router.get('/user/profile',function (req,res,next) { 
 res.render('user/profile');
});

 module.exports = router;

