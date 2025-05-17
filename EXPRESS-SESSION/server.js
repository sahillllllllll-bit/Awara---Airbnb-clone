const express=require("express")
const app= express()
const session= require("express-session");
const flash=require("connect-flash")
const path=require("path") 

const sessionoptions ={
    secret:"sahiliskingsecret",
    resave:false,
    saveUninitialized:true,
}
app.use(session(sessionoptions));
app.use(flash());
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));


app.get("/register",(req,res)=>{
    let {name="Anonymous"}= req.query;
    req.session.name=name;
    if(name==="Anonymous"){req.flash("error","User Not Registered")}
    else{
    req.flash("success","User Registered Succesfully");}
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    // res.send(`hello mf! ${req.session.name}`);
    res.locals.successmsg=req.flash("success")
    res.locals.errormsg=req.flash("error")

    res.render("page.ejs", {name:req.session.name})

})


app.listen(8000,()=>{
    console.log("app is listening at port 8080, thankyou!")
 })


// app.get("/sahil",(req,res)=>{           //this is to count requests
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count =1;
//     }
//     res.send(`this is your ${req.session.count} times request`)
// })

 app.get("/",(req,res)=>{
   
        res.send("hello, welcome to testing page")
 })
