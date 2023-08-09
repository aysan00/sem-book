const express = require("express");
const router = express.Router();
const ideas = require("../model/ideas");
const Cryptr = require("cryptr"),
cryptr = new Cryptr('secret_key');

function checkAuth(req,res,next){
    if(req.isAuthenticated()){
res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, post-check=0, precheck=0"
);



        console.log("user is authenticated");
next();
    }else{
res.redirect("/login");
    }
}

router.get("/",checkAuth,(req,res)=>{
    ideas.find({email:req.user.email},(err,data)=>{
        if(err) throw err;
        if(data){
            res.render("board",{csrfToken : req.csrfToken(), data:data});
        }
    });

});


router.get("/",checkAuth,(req,res)=>{
    ideas.find({email:req.user.email},(err,data)=>{
        if(err) throw err;
        if(data){
            res.render("texteditor",{csrfToken : req.csrfToken(), data:data});
        }
    });

});



router.post("/add",checkAuth,(req,res)=>{
    const {name,email,password,platform} = req.body;  
    //add to database
    ideas({
        email : req.user.email,
        name : name,
        password : password,
        platform : platform,
    }).save((err,data)=>{
        res.redirect("/board");
    });
});

module.exports = router;