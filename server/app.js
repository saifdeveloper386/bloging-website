const express =require("express");
const path =require("path");
const mongoose =require("mongoose");
const dotenv =require("dotenv");

var cookieParser = require('cookie-parser')
const { urlencoded } = require("express");
const app=express();
dotenv.config({path:"./config.env"})
require("./db/conn")
const PORT=process.env.PORT;
// const static_path= path.join(__dirname,"../public")
const static_path= path.join(__dirname,"../user/src/public")
app.use(express.static(static_path))
// app.use(fileUpload());
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(require('./auth'))
// app.get('/about',(req, res) => {
//     res.send("this is about page");
// });
// app.get('/contact', (req, res) => {
//     res.send("this is contact page");
// });
app.get('/signin', (req, res) => {
    res.send("this is signin page");
});
app.get('/signup', (req, res) => {
    res.send("this is sign up page");
});

console.log(static_path)
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});