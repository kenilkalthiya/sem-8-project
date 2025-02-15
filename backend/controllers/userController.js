// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import validator from "validator";
// import userModel from "../models/userModel.js";

// //create token
// const createToken = (id) => {
//     return jwt.sign({id}, process.env.JWT_SECRET);
// }

// //login user
// const loginUser = async (req,res) => {
//     const {email, password} = req.body;
//     try{
//         const user = await userModel.findOne({email})

//         if(!user){
//             return res.json({success:false,message: "User does not exist"})
//         }

//         const isMatch = await bcrypt.compare(password, user.password)

//         if(!isMatch){
//             return res.json({success:false,message: "Invalid credentials"})
//         }

//         const token = createToken(user._id)
//         res.json({success:true,token})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// //register user
// const registerUser = async (req,res) => {
//     const {name, email, password} = req.body;
//     try{
//         //check if user already exists
//         const exists = await userModel.findOne({email})
//         if(exists){
//             return res.json({success:false,message: "User already exists"})
//         }

//         // validating email format & strong password
//         if(!validator.isEmail(email)){
//             return res.json({success:false,message: "Please enter a valid email"})
//         }
//         if(password.length<8){
//             return res.json({success:false,message: "Please enter a strong password"})
//         }

//         // hashing user password
//         const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
//         const hashedPassword = await bcrypt.hash(password, salt)

//         const newUser = new userModel({name, email, password: hashedPassword})
//         const user = await newUser.save()
//         const token = createToken(user._id)
//         res.json({success:true,token})

//     } catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// export {loginUser, registerUser}

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

// Function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Token expires in 7 days
};

// Middleware to verify JWT token (optional, for protected routes)
export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
    if (!token) return res.status(401).json({ success: false, message: "Access Denied. No token provided." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // Generate JWT token
        const token = createToken(user._id);

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };
