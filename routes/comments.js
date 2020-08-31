var express = require("express");
var router  = express.Router();
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middleware=require("../middleware");



//========COMMENTS NEW ROUTES========//
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
      if(err){
        console.log(err);
        res.redirect("/campground")
      } else{
        res.render("comments/new",{campground:campground});
      }
    })
});    

//========CREATE NEW COMMENTS ROUTES========//  
router.post("/campgrounds/:id/comments/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
      if(err){
        req.flash("error","Something went wrong");
        res.redirect("/campgrounds");      
      } else{
        Comment.create(req.body.comment,function(err,comment){
          if(err){
            req.flash("error","Something went wrong");
          } else {
            comment.author.id=req.user._id;
            comment.author.username=req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash("success","Comment Added");
            res.redirect('/campgrounds/'+campground._id);
          }
        });
      }
    });
});

//========EDIT COMMENTS NEW ROUTES========//
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err){
      req.flash("error","Something went wrong");
      res.redirect("back");
    } else{
      res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})
    }
  });
});

//UPDATE COMMENT ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    } else{
      req.flash("success","Comment Updated");
      res.redirect("/campgrounds/" +req.params.id);
    }
  });
});

//DESTROY COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success","Comment Deleted");
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

module.exports=router;