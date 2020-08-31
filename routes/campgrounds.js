var express = require("express");
var router  = express.Router();
var Campground= require("../models/campground");
var middleware=require("../middleware");



//========CAMPGROUND ROUTES========//
router.get("/campgrounds", function(req, res){
    Campground.find({},function(err,campgrounds){
      if(err){
        req.flash("error","Something went Wrong");
        console.log(err);
      } else {
        res.render ("campgrounds/index",{campgrounds:campgrounds});
      }
    })
});
  
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
  
  
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc =req.body.description;
    var author ={
      id:req.user._id,
      username:req.user.username
    }
    var newCampground = {name:name,image:image,description:desc,author:author};
    Campground.create(newCampground,function(err,newData){
      if(err){
        console.log(err);
      }else {
        req.flash("success","Campground Added");
        res.redirect("/campgrounds");
      }
    });
});

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
     if(err){
       console.log(err)
     } else{
      res.render ("campgrounds/show",{campground:foundCampground});
     }
    })
});

// EDIT CAMPGROUND ROUTES
router.get("/campgrounds/:id/edit",middleware.checkOwnership,function(req,res){
      Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
      });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
      if(err){
      res.redirect("/campgrounds");
    } else 
    req.flash("success","Campground Updated");
    res.redirect("/campgrounds/"+req.params.id);
  });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",middleware.checkOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err,updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      req.flash("success","Campground Deleted");
      res.redirect("/campgrounds");
    }
  })
});

module.exports=router;