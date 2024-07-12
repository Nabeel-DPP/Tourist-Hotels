const mongoose = require("mongoose");


const listingSchema = new mongoose.Schema(
    {
        title: {
         type:String,
         required:true,
},
        description : String,
        image: {
            type:String,
            set : (v)=> v==="" ? "https://unsplash.com/photos/white-and-red-wooden-house-miniature-on-brown-table-rgJ1J8SDEAY" : v

        } ,
        price : Number,
        location : String,
        country : String
    }
);

const Listing = new mongoose.model("Listing" , listingSchema);

module.exports = Listing;

