const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    profilePicture: {
        type:String
    },
    role:{
        type:[String],
        required:true
    },
    courses:{
        type:[String],
        default:[]
    },
    roleToken: {
        type:String,
        default:''
    },
    resetPasswordToken:{
        type:String,
        default:''
    },
    resetPasswordExpires: {
        type:Date
    },
    profileImage: {
        public_id:{type:String},
        url: {type:String},
    },
});

const User = mongoose.models.User || mongoose.model("User",userSchema);

module.exports = User;