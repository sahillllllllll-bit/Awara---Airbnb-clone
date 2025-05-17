const express =require("express");
const wrapasync = require("../utils/wrapasync");
const router =  express.Router();
const User=require("../models/user.js")
const passport=require("passport");
// signup route


router.get("/signup",(req,res)=>{
    res.render("listing/signup.ejs")
})


router.post("/signup",wrapasync(async (req,res)=>{
    try{
 let {username,email,password}= req.body;
 const newuser= new User({email,username});
 const registeruser=await User.register(newuser,password);
console.log(registeruser)
req.login(registeruser,(err)=>{
   if(err){
      return next(err);
   }
   req.flash("success","Welcome to awara pvt ltd.");
   res.redirect("/listings");
})
    }catch(e){
 req.flash("error",e.message);
 res.redirect("/signup");
    }
}))

//login route
router.get("/login",(req,res)=>{
    res.render("listing/login.ejs")
})
router.post("/login",
   passport.authenticate("local",{failureRedirect:"\login",
    failureFlash:true,
   }) ,
   async(req,res)=>{
req.flash("success","Welcome back to awara pvt. ltd.");
res.redirect("/listings");
   }
)

// logout route

router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
      if(err){
         return next(err);
      }
      req.flash("success","successfully logged out");
      res.redirect("/listings");
   })
})


 module.exports=router;