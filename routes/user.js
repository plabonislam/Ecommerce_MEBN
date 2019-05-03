
var express = require('express');
var router = express.Router();
var passport=require('passport');
var csrf = require('csurf');//import csurf in csrf variable


var csrfProtection=csrf();//csurfProtection variable using csurf pacakage
router.use(csrfProtection);//all routes uses this csurf protection

router.get('/profile',isLoggedin,function (req,res,next) { 
  res.render('user/profile');
 });

router.use('/',notLoggedin, function(res,req,next)
{
next();
});

router.get('/signup',function (req,res,next) {
    var messages=req.flash('error');
    var cond;
    if(messages.length > 0)
      cond=true;
     else
     cond=false;
   res.render('user/signup', { csrftoken : req.csrfToken(),messages:messages,hasErrors: true });
 });
 
 router.post('/signup',passport.authenticate('local.signup',{
   
   failureRedirect:'/user/signup',
   failureFlash:true
  }),function(req,res,next)
  {
    if(req.session.oldurl)
    {
      
      var old=req.session.oldurl;
      req.session.oldurl=null;
      console.log(old);
      res.redirect(old);
    }
    else{
      res.redirect('/user/profile');
    }
  });

  
  router.get('/signin',function (req,res,next) {
   var messages=req.flash('error');
   var cond;
   if(messages.length > 0)
     cond=true;
    else
    cond=false;
  res.render('user/signin', { csrftoken : req.csrfToken(),messages:messages,hasErrors: true });
 });
 
 router.post('/signin',passport.authenticate('local.signin',{
   
   failureRedirect:'/user/signin',
   failureFlash:true
  }),function(req,res,next)
  {
    if(req.session.oldurl)
    {
      
      var old=req.session.oldurl;
      req.session.oldurl=null;
      console.log(old);
      res.redirect(old);
    }
    else{
      res.redirect('/user/profile');
    }
  });
 

 

 module.exports=router;

 function isLoggedin(req,res,next)
 {
   if(req.isAuthenticated())
   {
     return next();
   }
   res.redirect('/');
 }

 function notLoggedin(req,res,next)
 {
   if(!req.isAuthenticated())
   {
     return next();
   }
   res.redirect('/');
 }
