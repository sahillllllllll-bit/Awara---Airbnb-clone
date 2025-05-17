const express =require("express");
// const router =  express.Router();
const router = express.Router({ mergeParams: true });
const {isloggedin}= require("../middleware")


const wrapasync=require("../utils/wrapasync.js")   //require
const expresserror=require("../utils/expresserror.js")
const review=require("../models/review.js");
const listing =require("../models/listing.js")

  // review route

  router.post("/", isloggedin,async (req,res)=>{
    let Listing= await listing.findById(req.params.id);
  
    let newreview = new review(req.body.review);
  
    Listing.review.push(newreview);
    newreview.owner=req.user._id;

    await newreview.save();
    await Listing.save();
    console.log("review send")
    res.redirect(`/listings/${Listing._id}`)
   })
 
 
   // delete review route
 router.delete("/:reviewId",  wrapasync(async (req,res)=>{
   let { id, reviewId}=req.params;
   await listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
   await review.findByIdAndDelete(reviewId);
 
   res.redirect(`/listings/${id}`)
 }))
 
 module.exports = router;
