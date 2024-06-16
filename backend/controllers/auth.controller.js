import User from "../models/usermodel.js";
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/generateToken.js'

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await User.findOne({ username }); // Await this operation
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const boyUserProfile = `https://avatar.iran.liara.run/public/boy${username}`;
        const girlUserProfile = `https://avatar.iran.liara.run/public/girl${username}`;

        // hashing the password:
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);



        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            gender,
            profilePic: gender === "male" ? boyUserProfile : girlUserProfile,
        });

        if(newUser){
// jwt token generation:
generateTokenAndSetCookie(newUser._id, res);
        await newUser.save(); 

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    }
    else{
        res.status(400).json({error:"invalid user data"});
    }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const login = async (req,res)=>{
    try{
        const {username,password}= req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect= await bcrypt.compare(password,user?.password || ""); 

        if(!user || !isPasswordCorrect){
            return res.status(401).json({error:"incorrect username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePic: user.profilePic
        })


    }
    catch(error){
        console.log("Error in login controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
    
}

export const logout = async (req,res)=>{
try{
    res.cookie("jwt","",{maxage:0});
    res.status(200).json({message:"user logged out"});
}
catch(error){
    console.log("error in logout controller",error.message);
    res.status(401).json({error:"internaaal server error"});
}
}
