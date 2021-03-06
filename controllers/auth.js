const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");


// @desc = Register User
// @route = POST /api/v1/auth/register
// @access = Public

exports.register = asyncHandler(async(req, res, next)=>{
    const {name, email, password, role} = req.body

    // Create User

    const user = await User.create({
        name,
        email,
        password,
        role
    })
//    // create token
//     const token = user.getSignedJwtToken()
    
//     res.status(200).json({success:true, token})
   sendTokenResponnse(user, 200, res)
})

// @desc = Login User
// @route = POST /api/v1/auth/login
// @access = Public

exports.login = asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body

    // Validate Email And Password
    if(!email || !password){
        return next (new ErrorResponse('Please Provide Email And Password', 400))
    }

    // Check For User
    const user = await User.findOne({email}).select('+password')
    
    if(!user){
        return next (new ErrorResponse('Invalid Credentials', 401))
    }

    // check passwor matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next (new ErrorResponse('Invalid Credentials', 401))
    }
    
    // Create Token
    // const token = user.getSignedJwtToken()
    // res.status(200).json({success:true, token})

    sendTokenResponnse(user, 200, res)

    //Get Token From model, create cookie and send response

   
})




// @desc = Get current logged in user
// @route = POST /api/v1/auth/me
// @access = Private 

exports.getMe = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        data: user
    })
})


// @desc = Forgot Password
// @route = POST /api/v1/auth/forgotpassword
// @access = Public

exports.forgotPassword = asyncHandler(async(req, res, next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next (new ErrorResponse('There is no user with that email', 404))
    }

    //Get Reset Token

    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})

    // Create Reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested 
    the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

    try{
       await sendEmail({
           email:user.email,
           subject : 'Password reset token',
           message
       })
       res.status(200).json({success:true, data: 'Email Sent'})
    }
    catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorResponse('Email Could Not Be Sent', 500))
    }

    res.status(200).json({
        success:true,
        data: user
    })
})

// helper
const sendTokenResponnse = (user, statusCode, res) =>{
    // create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV ==='production'){
        options.secure = true
    }

    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success:true,
        token
    })
}