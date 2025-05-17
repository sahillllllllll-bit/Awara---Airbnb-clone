const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =require("./review.js")
const User =require("./user.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename:String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  review:[
    {
    type: Schema.Types.ObjectId,
    ref: "Review",    
    },
  ],
  owner:{
   type :  Schema.Types.ObjectId,
  ref: "User",
}
});
  // this is middleware , it is used here for , when we delete the listin then reviews are not deleted from the database , to overcome this problem we make middleware - it is called when request listing delete route
listingSchema.post("findOneAndDelete",async (listing)=>{
if (listing){
  await Review.deleteMany({_id:{$in: listing.review}});
}
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;