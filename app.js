if(process.env.NODE_ENV !="production"){
  require("dotenv").config();                     // we dont have to  share env at the time of deployment
  
}
// console.log(process.env.KEY)    to print the value

const express=require("express")
const app= express()
const mongoose=require("mongoose")
const listing =require("./models/listing")
const path=require("path") 
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapasync=require("./utils/wrapasync.js")   //require
const expresserror=require("./utils/expresserror.js")
const session=require("express-session")
const flash=require("connect-flash")
const review=require("./models/review.js");
const listingsrouter =require("./routes/listing.js");
const userrouter =require("./routes/user.js");
const reviewrouter =require("./routes/review.js");

// const { networkInterfaces } = require("os")

const passport= require("passport")    
const localstrategy=require("passport-local")
const User=require("./models/user.js");



app.engine('ejs',ejsmate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));




const sessionoptions ={
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
   expires:Date.now()+4*24*60*60*1000,
   maxAge:4*24*60*60*1000,
   httpOnly:true,
  },
}
app.use(session(sessionoptions));   
app.use(flash());       // we have to use this before routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser=req.user;


  next();
})
// registering demo user 

// app.get("/demouser",async (req,res)=>{
//   let  fakeuser= new User({
//     email:"sahilsingh@gmail.com",
//     username:"sahilx__1",

//   })
//   let  registereduser =await User.register(fakeuser,"helloworld");
//   res.send(registereduser);
// })



app.use("/listings", listingsrouter);
app.use("/listings/:id/review",reviewrouter)
app.use("/",userrouter)


const mongo ="mongodb://127.0.0.1:27017/awara";
main().then(()=>{
    console.log("succesfully connected to awara's database")
}).catch(err=>{
    console.log("awara's database declined your request")

})
 async function  main(){
    await mongoose.connect(mongo)
 }
 app.listen(8090,()=>{
    console.log("app is listening at port 8090, thankyou!")
 })
 app.get("/",(req,res)=>{
    res.send("hello, welcome to awara enterprises")
 })

  app.all("",(req,res,next)=>{
    next(new expresserror(404,"Page Not Found"));
  })

  app.use((err,req,res,next)=>{
    let{statuscode =500, message ="something went wrong"}=err;
    res.status(statuscode).send(message);
  })