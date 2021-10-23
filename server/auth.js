const express = require('express');
const multer = require('multer');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const router =express.Router();
const bcrypt =require("bcrypt");
const jwt =require("jsonwebtoken");
require("./db/conn")
const User=require("./models/userSchema")
const Post=require("./models/postSchema")
const authenticate=require("./middleware/authenticate")

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"../user/src/public/uploads")
        
    },
    filename:(req,file,cb)=>{
        // cb(null,file.originalname)
        cb(null,file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
    
})
const upload= multer({storage:storage});
// console.log(upload.destination)



router.get('/', (req, res) => {
    res.send("hello world");
});

// using promises
// router.post('/register', (req, res) => {
//     const {name,email,phone,work,password,cpassword}=req.body
//    if(!name||!email||!phone||!work||!password||!cpassword){
//        return res.json({err:"fill all the details"})
//    }
//    User.findOne({email:email})
//    .then((userExist)=>{
//        if(userExist){
//         return res.json({err:"email is already exist"})
//        }
//        const user=new User(req.body);
//        user.save().then(()=>{
//            res.json({message:"user registered"})
//        }).catch((err)=>{
//            res.json({error:"something went wrong"+err})
//        })
//    }).catch((err)=>{
//        console.log(err+"erro")
//    })  
// });

// using async await 


router.post('/register', async(req, res) => {
    const {name,email,phone,work,password,cpassword}=req.body
   if(!name||!email||!phone||!work||!password||!cpassword){
       return res.status(420).json({err:"fill all the details"})
   }
   try {
   const userExist=await User.findOne({email:email})
    if(userExist){
        return res.status(422).json({err:"email is already exist"})
       }else if(password != cpassword){
        return res.status(423).json({err:"password and confirm password not matching"})
       }else{

           const user=new User(req.body);
           await  user.save();
           console.log(user)

           res.status(200).json({message:"user registered"})
       }
  

   } catch (error) {
    console.log(error+"error")
   }
});

router.post("/signin",async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email|| !password){
        res.status(400).json({error:"please fill all the data correctly"})   
        }
        const userLogin=await User.findOne({email:email})
        if(userLogin){
            console.log(userLogin)
            const isMatched=await bcrypt.compare(password,userLogin.password)
            const token=await userLogin.generateAuthToken()
            console.log(token)
            res.cookie("jwtToken",token,{
                expires:new Date(Date.now()+2592000000),
                httpOnly:true  
            })
            if(!isMatched){
                res.status(401).json({error:"password is incorrect"})
            }else{
                res.redirect("/")
            }
        }else{
            res.status(402).json({error:"this email doesn't exist"})
        }
      
        
    } catch (error) {
        console.log(error)
    }
})

router.get('/about',authenticate,(req, res) => {
    res.send(req.rootUser);
});
router.get('/getData',authenticate,(req, res) => {
    res.send(req.rootUser);
});
router.get('/getPost',authenticate,(req, res) => {
    res.send(req.userPost);
});
router.get("/post/:id",authenticate, async (req, res) => {
    
    const post = await Post.findById(req.params.id);
    if(!post) {
        res.status(500).json({message: 'The post with the given ID was not found.'})
    } 
    res.status(200).send(post);
})
router.post('/contact',authenticate, async (req, res) => {
    try {
       const {name,email,phone,subject,message}=req.body
       if(!name || !email || !phone || !subject || !message){
        console.log("some error");
        res.status(401).json({error:"please fill the form completely"})
    }
       const userContact=await User.findOne({_id:req.userId});
       if(userContact){
           const userMessage=await userContact.addMessage(name,email,phone,subject,message)    
           await userContact.save();
           console.log(userMessage)
           res.status(201).json({message:"contact message added successfully"})
         }

    } catch (error) {
        console.log(error);
    }
});


router.post('/createPost', authenticate,upload.single("postImage"), async(req, res) => {


    const {name,email,title,category,subject,message}=req.body
   if(!name||!email||!title||!category||!subject||!message || !postImage){
       return res.status(420).json({err:"fill all the details"})
   }
   try {
     
const post = new Post({
  name:req.body.name,
  email:req.body.email,
  title:req.body.title,
  category:req.body.category,
  subject:req.body.subject,
  message:req.body.message,
  postImage:req.file.filename,

})
// post.postImage=fs.readFileSync(req.file.path)
// post.postImage.contentType=req.file.type
           await  post.save();
           res.status(200).json(post)
        //    console.log(post)
        //    console.log("this is image " + " " +post.postImage)
        //    console.log("this is originalname " + " " +req.file.originalname)
        //    console.log("this is filename " + " " +req.file.filename)
        //    console.log("this is fieldname " + " " +req.file.fieldname)

    
  


   } catch (error) {
    console.log(error+"error")
   }
});

// router.get("/post/:id", async (req, res) => {
//     const post = await Post.findById(req.params.id);
//    res.send(post);
//     console.log(post);
// })



router.get('/logout',(req, res) => {
    res.clearCookie("jwtToken",{path:"/"})
  res.status(200).send("user logged out")
});

// router.delete('/post/:id', (req, res)=>{
//     Post.findByIdAndRemove(req.params.id).then(post =>{
//         if(post) {
//             return res.status(200).json({success: true, message: 'the post is deleted!'})
//         } else {
//             return res.status(404).json({success: false , message: "post not found!"})
//         }
//     }).catch(err=>{
//        return res.status(500).json({success: false, error: err}) 
//     })
// })

module.exports=router 