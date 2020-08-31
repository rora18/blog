//all the middleware
var Campground= require("../models/campground");
var Comment= require("../models/comment");

var middlewareObj={};

middlewareObj.checkOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","Something went Wrong");
            res.redirect("back");
        } else{
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            } else{
                req.flash("error","You Don't have permission to do that");
                res.redirect("back");
            } 
        }
        });
    } else {
        req.flash("error","You Need to Login");
        res.redirect("back");
    }   
}

middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Something went Wrong");
            res.redirect("back");
        } else{
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else{
                req.flash("error","You Don't have permission to do that");
                res.redirect("back");
            } 
        }
        });
    } else {
        req.flash("error","You Need to Login");
        res.redirect("back");
    }
}      

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash("error","Please Login!!!");
      res.redirect("/login");
    }
}

module.exports=middlewareObj