var express = require('express');
var router = express.Router();



module.exports = function(passport){
  // send successful login state back to the angular
  router.get('/success', function(req,res){
    res.send({state:'success', user:req.user ? req.user : null});
    console.log("Success login");
  });

  // send failure login state back to angular
  router.get('/failure', function(req,res){
    res.send({state:'failure', user:null, message: 'Invalid username or password :( '});
  });

  // log-in 
  router.post('/login', passport.authenticate('login',{
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
  }));

  // sign-up
  router.post('/signup', passport.authenticate('signup',{
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
  }));
  
  // log-out
  router.get('/signout', function(req,res){
    req.logout();
    res.redirect('/');
  });

  return router;
};
