var express = require("express");
var router  = express.Router();
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middleware=require("../middleware");



//========COMMENTS NEW ROUTES========//
router.get("/blogs/:id/comments/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
      if(err){
        console.log(err);
        res.redirect("/blogs")
      } else{
        res.render("comments/new",{campground:campground});
      }
    })
});    

//========CREATE NEW COMMENTS ROUTES========//  
router.post("/blogs/:id/comments/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
      if(err){
        req.flash("error","Something went wrong");
        res.redirect("/blogs");      
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
            res.redirect('/blogs/'+campground._id);
          }
        });
      }
    });
});

//========EDIT COMMENTS NEW ROUTES========//
router.get("/blogs/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
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
router.put("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    } else{
      req.flash("success","Comment Updated");
      res.redirect("/blogs/" +req.params.id);
    }
  });
});

//DESTROY COMMENT ROUTE
router.delete("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success","Comment Deleted");
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

module.exports=router;