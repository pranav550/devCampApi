const mongoose =  require("mongoose");
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please Add A Name']
    },
    email:{
        type:String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
          ]
    },
    role:{
        type:String,
        enum:['user', 'publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true, 'Please Add A Password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('User', UserSchema)