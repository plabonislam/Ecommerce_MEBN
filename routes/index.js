var express = require('express');
var router = express.Router();
var passport=require('passport');

var Product=require('../models/product');
var Cart=require('../models/cart');
var User = require("../models/user");


//for mail
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
//end for mail

var multer=require('multer');
const path=require('path');


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




router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('message', 'Password reset token is invalid or has expired.');
      return res.redirect('/user/forgot');
    }
    res.render('user/reset', {token: req.params.token});
  });
});



router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('message', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
            user.password=user.encryptPassword(req.body.confirm);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          
        } else {
            req.flash("message", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'shahnurislamplabon@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'shahnurislamplabon@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('message', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
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

router.get('/remove-cart/:id',function(req,res,next){
var productid=req.params.id;

var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productid, function(err, product) {
     if (err) {
         return res.redirect('/');
     }
      cart.remove(product, product.id);
      req.session.cart = cart;//store cart to session
 console.log(req.session.cart);
  res.redirect('/shoppingcart');

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




router.get('/productup',function(req,res){
  var succ=req.flash('message')[0];
 res.render('upimage/imageview',{success:succ,nosuccess:!succ});

});


router.post('/upload',function(req,res){

        


  //set up storage 
  var storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  //calliing storage method and limit file and its type
  var upload = multer({ 
    storage: storage,
    limits:{ fileSize:1000000},//check size
    fileFilter:function(req,file,cb){
      check(file,cb);
    }
  }).single('avatar');
  
  
  //checking exten
  function check(file,cb)
  {
    //allow ext
    const filetypes=/jpeg|jpg|png|gif/;
    //check est 
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype=filetypes.test(file.mimetype);
    if(extname && mimetype)
    {
      return cb(null,true);
    }
    else
    {
      return cb('err','typ not matched');
    }
  }
  
   //checks 
   upload(req, res, function (err) {
   if(err)
   {
    req.flash('message', err);
    res.redirect('/imageup');
   }
   else{
    console.log(req.file.filename);
  
    var item={
      imagePath:req.file.filename,
      title:req.body.title,
      description:req.body.description,
      price: req.body.price
  
    }
    var product = new Product(item);
    product.save();
    res.redirect('/');
  }
   
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
