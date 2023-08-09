const express = require("express");
const router = express.Router();
const users = require("../model/user");
var bcrypt = require('bcryptjs');
const passport = require("passport");
require('./passportLocal')(passport);

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    res.render("home",{logged: true});
  }else{
    res.render("home")
  }
});


router.get("/", (req, res) => {
  res.send("This is from Accounts home");
});

router.get("/login", (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

router.get("/texteditor", (req, res) => {
  res.render("texteditor");
});


router.get("/signup", (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
});

router.post("/signup", async (req, res) => {
  const { name, email, username, password, confirmpassword } = req.body;

  if (!name || !email || !username || !password || !confirmpassword) {
    res.render("signup", {
      csrfToken: req.csrfToken(),
      err: "All fields required!",
    });
  } else if (password != confirmpassword) {
    res.render("signup", {
      csrfToken: req.csrfToken(),
      err: "Passwords are not matching!",
    });
  } else {
    var userData = await users.findOne({
      $or: [{ email: email }, { username: username }],
    });

if(userData){
    res.render("signup", {
        csrfToken: req.csrfToken(),
        err: "User Exists! Try again",
      });
}else{
var salt = await bcrypt.genSalt(12);
var hash = await bcrypt.hash(password, salt);

await users({
    name:name,
    email:email,
    username:username,
    password:hash,
}).save();

res.redirect("/login");

}

  }
});


router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    failureRedirect : '/login',
    successRedirect : '/board',
    failureFlash : true,
  })(req,res,next);
});


router.get('/logout',(req,res)=>{
  req.logOut();
  req.session.destroy((err)=>{
res.redirect('/');
  })
})
//board routes
router.use('/board',require("./idearoutes"));


module.exports = router;
