var express = require("express");
var router  = express.Router();
var passport     = require("passport");
var User = require("../models/user")

//========HOME ROUTES========//
router.get("/",function(req,res){
    res.render ("landing");
    });
  
  
//========REGISTER ROUTES========//
router.get("/register",function(req,res){
    res.render("register");
});
  
router.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
      if(err){
//        req.flash("error",err.message);
        req.flash("error","Some error");
        // res.send(err.message);
        return res.redirect("register");
      }
      passport.authenticate("local")(req,res,function(){
        req.flash("Success","Welcome to My Blog "+ user.username);
        res.redirect("/blogs");
      });
    });
});
  
//========LOGIN ROUTES========//
router.get("/login",function(req,res){
    res.render("login");
});
  
router.post("/login",passport.authenticate("local",
    {
      successRedirect:"/blogs",
      failureRedirect:"/login",
      failureFlash:true,
      successFlash:"Successfully Signed in"
    }),function(req,res){
});
  
  //LOGOUT ROUTE
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out")
    res.redirect("/blogs");
});
  
module.exports=router;