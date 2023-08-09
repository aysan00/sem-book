const users = require("../model/user");
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const user = require("../model/user");

module.exports = (passport)=>{

passport.use(new localStrategy({ usernameField: "username"},(username,password,done)=>{
    users.findOne({username:username},(err,data)=>{
        if(err) throw err;
        if(!data){
            return done(null,false,{message : "User Doesn't Exists !"});
        }
        bcrypt.compare(password,data.password,(err,match)=>{
            if(err) throw err;
            if(match){
                return done(null,data);
            }
            if(!match){
                return done(null,false,{message : "Wrong details!!"});
            }
        });
    });
})
);

    passport.serializeUser(function(user,done){
        done(null , user.id);
    });
    passport.deserializeUser(function(id, done){
        users.findById(id,function(err,user){
            done(err,user);
        });
    });
};
