const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose= require("passport-local-mongoose");

const userschema= new Schema({
    email:{
        type:String,
        required:true          // passport local mongoose automatically     add  username and password  schema
    }
})

userschema.plugin(passportlocalmongoose);
module.exports=mongoose.model('User',userschema); 
