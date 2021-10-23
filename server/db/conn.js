const mongoose=require("mongoose")
const dotenv =require("dotenv");


const DB=process.env.DATABASE; 
mongoose.connect(DB).then(()=>{
    console.log("connection is successful")
}).catch((err)=>{
    console.log("err"+err);
})