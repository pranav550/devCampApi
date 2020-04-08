const logger = (req, res, next)=>{
    console.log("sssssss")
    next();
}


module.exports=logger