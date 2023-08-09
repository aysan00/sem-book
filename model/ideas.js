const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
    },
    password:{
        type :String,
        required : true,
    },
    platform:{
        type : String,
        required : true,
    },
    created:{
        type : Date,
        default:()=>Date.now(),
    },
});

module.exports = mongoose.model('idea',ideaSchema);