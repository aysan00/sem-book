const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const express = require("express");
const app = express();
const router = require("./controller/routes");
const csruf = require('csurf');
const passport = require('passport');
const flash = require('connect-flash');


const PORT = process.env.PORT || 1000;
require("./config/conn");
app.use(express.urlencoded({extended:true}));
app.use("/static",express.static(__dirname + "/static"));

app.set("view engine","ejs");
app.set("views",__dirname + "/views");

app.use(cookieParser("randomKey"));
app.use(expressSession({
  secret : "randomKey",
  resave :true,
  maxAge : 24*60*60*1000,
})
);

app.use(csruf());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
  res.locals.error = req.flash("error");
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`server is running at port number ${PORT}`);
});
