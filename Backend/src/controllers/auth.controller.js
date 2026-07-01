const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * 
 * @name registerUserController
 * @description Register a new user
 * @access Public
 */
async function registerUserController(req,res){
    const {username,email,password} = req.body;

    if(!username || !email || !password)
    {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [{ username },{ email }]  // Find me one user whose username OR email matches the given data
    })

    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username == username)
        {
            return res.status(400).json({
            message:"Account already exits with this username"
        });
        }
        if(isUserAlreadyExists.email == email)
        {
            return res.status(400).json({
            message:"Account already exits with this email address"
        });
        }
    }

    const userObj = {
        username,
        email,
        password:bcrypt.hashSync(password,10)
    }
    const user = await userModel.create(userObj);

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.cookie("token",token); // since we added token in cookie no need to send token in response
    res.status(201).json({
        message:"User registered successfully",
        user:{
            id: user._id,
            username:user.username,
            email:user.email
        }
    })


}


/**
 * 
 * @name loginUserController
 * @description Logins a user
 * @access Public
 */


async function loginUserController(req,res)
{
    console.log("BODY:", req.body);
    const {email,password} = req.body;

    if(!email || !password)
    {
        return res.status(400).json({
            message: "Please provide email and password"
        })
    }

    const user = await userModel.findOne({email});

    if (!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = bcrypt.compareSync(password,user.password);

    if (!isPasswordValid){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.cookie("token",token);

    res.status(200).json({
        message : "User logged in Successfully",
        user:{
            id : user._id,
            username : user.username,
            email: user.email
        }
    })


}


/**
 * 
 * @name logoutUserController
 * @description clear token from user cookie and add token in blacklist
 * @access Public
 */

async function logoutUserController(req,res){
    const token = req.cookies.token;

    if(token)
    {
        await tokenBlacklistModel.create({token})
        
    }
    res.clearCookie("token");
    res.status(200).json({
        message:"User logged out Successfully"
    })

}


/**
 * 
 * @name getMeController
 * @description get the current logged in user details
 * @access Private
 */

async function getMeController(req,res){

        const user = await userModel.findById(req.user.id);
        res.status(200).json({
        message:"user details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController

}