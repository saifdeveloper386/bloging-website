const mongoose =require("mongoose")
const jwt=require("jsonwebtoken")

const postSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    postImage:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
})


const Post=mongoose.model("Post",postSchema);
module.exports=Post;


