// const bcrypt = require('bcryptjs')
// const userModel = require('../../models/userModel')
// const jwt = require('jsonwebtoken');

// async function userSignInController(req,res){
//     try{
//         const { email , password} = req.body

//         if(!email){
//             throw new Error("Please provide email")
//         }
//         if(!password){
//              throw new Error("Please provide password")
//         }

//         const user = await userModel.findOne({email})

//        if(!user){
//             throw new Error("User not found")
//        }

//        const checkPassword = await bcrypt.compare(password,user.password)

//        console.log("checkPassoword",checkPassword)

//        if(checkPassword){
//         const tokenData = {
//             _id : user._id,
//             email : user.email,
//         }
//         const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

//         const tokenOption = {
//             httpOnly : true,
//             secure : true
//         }

//         res.cookie("token",token,tokenOption).status(200).json({
//             message : "Login successfully",
//             data : token,
//             success : true,
//             error : false
//         })

//        }else{
//          throw new Error("Please check Password")
//        }







//     }catch(err){
//         res.json({
//             message : err.message || err  ,
//             error : true,
//             success : false,
//         })
//     }

// }

// module.exports = userSignInController




const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                error: true,
                success: false,
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                error: true,
                success: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                error: true,
                success: false,
            });
        }

        // Generate token
        const tokenData = { _id: user._id, email: user.email };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
            expiresIn: '8h',
        });

        const tokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.cookie('token', token, tokenOptions).status(200).json({
            message: "Login successful",
            success: true,
            error: false,
            data: { token },
        });
    } catch (err) {
        console.error(err); // For debugging in development
        res.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

module.exports = userSignInController;
