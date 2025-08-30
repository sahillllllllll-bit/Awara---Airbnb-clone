const express =require("express");
const router =  express.Router();
const wrapasync=require("../utils/wrapasync.js")  
const listing =require("../models/listing")
const expresserror=require("../utils/expresserror.js")
const {isloggedin}= require("../middleware")
const multer=require("multer");
const {storage}= require("../cloudconfig.js")

const upload =multer({storage})






// index route 
router.get("/",  async  (req,res)=>{
   const all= await listing.find({});
       res.render("listing/index.ejs",{all})
    
 })

 //New Route
 router.get("/new", isloggedin , (req, res) => {
   res.render("listing/new.ejs");
  });

 // show route

 router.get("/:id", async (req,res)=>{
 let {id}= req.params;
//  const list = await listing.findById(id)
//  .populate("review")
//  .populate("owner");
const list = await listing.findById(id)
.populate("owner")
.populate({
  path: "review",
  populate: {
    path: "owner",
    model: "User"
  }
});
//  console.log(list);
if(!list){
    req.flash("error","Listing you requested for does not exist!")
    res.redirect("/listings")
}

 res.render("listing/show.ejs",{list})
 })

  //Create Route
 router.post(
    "/listings", 
    isloggedin ,
    upload.single("listing[image]"),
    wrapasync(async (req, res,next) => {
      let url =req.file.path;
      let filename=req.file.filename;
     const newListing = new listing(req.body.listing);    // we create wrapsync and require it to handle errors
     newListing.owner=req.user._id;
     newListing.image={url,filename};
     await newListing.save();
     req.flash("success","Listing Created")
     res.redirect("/listings");
   }));
   
   //Edit Route
   router.get("/:id/edit",isloggedin , async (req, res) => {
     let { id } = req.params;
     const listings = await listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
let originalurl=listings.image.url;
originalurl=originalurl.replace("/upload","uploadh_300,w_300");

     res.render("listing/edit.ejs", { listings ,originalurl});
   });
   
   //Update Route
   router.put("/:id",isloggedin ,
     upload.single("listing[image]"),
    async (req, res) => {
     let { id } = req.params;
     let listings=await listing.findByIdAndUpdate(id, { ...req.body.lising });
   if(typeof req.file!="undefined"){
     let url =req.file.path;
      let filename=req.file.filename;
      listings.image={url,filename}
      await listings.save();
   }
   
     res.redirect(`/listings/${id}`);
   });
   
   //Delete Route
   router.delete("/:id",isloggedin , async (req, res) => {
     let { id } = req.params;
     let deletedListing = await listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
   });

   module.exports=router;