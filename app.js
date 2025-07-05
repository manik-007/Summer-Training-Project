import express from 'express'
// import User from "./User/User.js"
const app =  express();

import fake from './User/fake.js';


import path from "path";
import session  from 'express-session';
import cookieParser, { signedCookie } from 'cookie-parser';





import  LocalStrategy from "passport-local";
import mongoose from 'mongoose';





app.use(cookieParser("sarthik_khanna"));

app.use(session({
    secret:"sarthik_khanna",
    resave:false,
     saveUninitialized: true,
  cookie: { secure: true }
}))


// mongoose.connect('mongodb://127.0.0.1:27017/loginLogic')
//   .then(() => console.log('Connected!'));



  app.use(express.urlencoded({ extended: true }));

  // Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory
// app.set('views', path.join(__dirname , 'views'));

app.get("/",(req, res)=>{
    res.render("home.ejs");
    
});

app.get("/fake" ,(req ,res)=>{

    let fake1 = new fake({
        username:"prince",
        password:"1234",
        email:"p123@gmail"
    });
    fake1.save().then((d)=>{
        console.log(d);
    })


});

app.get("/cookie",(req ,res)=>{

    res.cookie("name" ,"prince");
     res.cookie("lastName" ,"tiwari",{signed:true});
  let username= req.cookies.name;
  console.log(lst);
  console.log(username);
    console.log("cookies" , req.cookies);
      console.log("signcookies" , req.signedCookies);
    res.send("helo")
});



app.get("/signup" ,async(req ,res)=>{

    res.render("signup.ejs");

});


app.post("/signup",async(req ,res, next)=>{

  let  { username , email , passport} = req.body

  if(username===fake.username&& passport===fake.password){
    res.cookie('auth' , username ,{signed:true});
    res.send('Invalid credentials. <a href="/login">Try again</a>')
  }
  else{
    res.send('Invalid credentials. <a href="/login">Try again</a>');
  }
    
})



let port = 8080;

app.listen(port ,()=>{
    console.log("connected to the port of 8080");
});