const express = require("express");
const app=express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const port=8080;
const path = require("path");
const methodOverride = require("method-override");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"./public")));

main().then(()=>{
    console.log("Connected with Mongo DB");
}).
catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.listen(port , (req,res)=>{
    console.log(`Server is Working and Listening through the Port no : ${port}`);
});
app.get("/",(req,res)=>{
    res.send("Welcome to the Home Page");
});
// app.get("/testListing", (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My House ",
//         description :"The House is situated in front of Govt Degree College Fsd",
//         image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.houzz.com%2Fphotos%2Fcollege-house-contemporary-exterior-melbourne-phvw-vp~83518523&psig=AOvVaw0TPScbJhqYIvNBII5OSiau&ust=1708981788272000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLDN6L6zx4QDFQAAAAAdAAAAABAD",
//         price: 2500,
//         location : "Faisalabad",
//         country: "Pakistan"
//     });
//     sampleListing.save().then(()=>{
//         console.log("SampleListing has been saved to DB");
//     }).catch((err)=>console.log(`Error ${err} is occuring in savind data`));
    
//     res.send("Successful Saving of Data");
// });

app.get("/listings",  wrapAsync( async (req,res)=>{
 const allListings = await Listing.find({});
 res.render("./listings/index.ejs" , {allListings});
  
}));

app.get("/listings/create",(req,res)=>
{
    res.render("./listings/create.ejs");
} )

app.get("/listings/:id", wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let list=  await Listing.findById(id);

    res.render("./listings/show.ejs",{list});
}));

app.post("/listings" , wrapAsync (async(req,res,next) => {
     
     if(!req.body.listing)
     {
         throw new ExpressError(400,"Enter Valid Data for the List");
     }
     
        let listing = req.body.listing;
        const newListing = new Listing(listing);
    
        await newListing.save();
        res.redirect("/listings");
})
   );

app.get("/listings/:id/edit" , wrapAsync( async (req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
     
    res.render("./listings/edit.ejs",{list});
}));

app.put("/listings/:id" ,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
     res.redirect("/listings"); 


}));

app.delete("/listings/:id/delete" , wrapAsync( async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

} ));

app.use("*" , (req,res,next)=>
{
  next( new ExpressError(404,"Page Not Found"));
});



app.use((err,req,res,next)=>
{

  let {statusCode =500 , message="Something Went Wrong in the Server!" } = err;
 
  res.render("error.ejs", {message});

//   res.send(message).status(statusCode);

//   res.send("Error Occured");
  });













