const jwt=require("jsonwebtoken");
const User=require("../models/userSchema")
const Post=require("../models/postSchema")




const authenticate = async(req,res,next) => {
try {
const token = req.cookies.jwtToken;
const verifyToken = jwt.verify(token , process.env.SECRET_KEY)
const rootUser= await User.findOne({_id:verifyToken._id,"tokens.token":token})
const UserPost= await Post.find({})
if(!rootUser){ throw new Error("user not found")}
req.token=token;
req.rootUser=rootUser;
req.userId=rootUser._id
req.userPost=UserPost
req.postId=UserPost._id
next();

} catch (error) {
    res.status(401).send("unauthorized :no token provided")
    console.log(error)
}
}


module.exports=authenticate