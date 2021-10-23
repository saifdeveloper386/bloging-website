const mongoose =require("mongoose")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            phone:{
                type:Number,
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
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]

})
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,15)
        this.cpassword=await bcrypt.hash(this.cpassword,15)
    };
    next();
})
userSchema.methods.generateAuthToken=async function () {
try {
    const sToken= jwt.sign({_id:this._id}, process.env.SECRET_KEY) ;
    this.tokens=this.tokens.concat({token:sToken});
    await this.save()
    return sToken;
} catch (error) {
    console.log(error)
}
}
userSchema.methods.addMessage=async function (name,email,phone,subject,message) {
try {
    this.messages=this.messages.concat({name,email,phone,subject,message});
    await this.save();
    return this.messages;
} catch (error) {
    console.log(error)
}
}



const User=mongoose.model("User",userSchema);
module.exports=User;


