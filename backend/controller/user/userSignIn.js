




// const bcrypt = require('bcryptjs');
// const userModel = require('../../models/userModel');
// const jwt = require('jsonwebtoken');

// async function userSignInController(req, res) {
//     try {
//         const { email, password } = req.body;

//         // Validation
//         if (!email || !password) {
//             return res.status(400).json({
//                 message: "Email and password are required",
//                 error: true,
//                 success: false,
//             });
//         }

//         const user = await userModel.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 message: "Invalid email or password",
//                 error: true,
//                 success: false,
//             });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({
//                 message: "Invalid email or password",
//                 error: true,
//                 success: false,
//             });
//         }

//         // Generate token
//         const tokenData = { _id: user._id, email: user.email };
//         const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
//             expiresIn: '8h',
//         });

//         const tokenOptions = {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//         };

//         res.cookie('token', token, tokenOptions).status(200).json({
//             message: "Login successful",
//             success: true,
//             error: false,
//             data: { token },
//         });
//     } catch (err) {
//         console.error(err); // For debugging in development
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: true,
//             success: false,
//         });
//     }
// }

// module.exports = userSignInController;
const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;
        
        // Debug log
        console.log("Login attempt for email:", email);

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                error: true,
                success: false,
            });
        }

        const user = await userModel.findOne({ email });
        
        // Debug log
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                error: true,
                success: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        // Debug log
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                error: true,
                success: false,
            });
        }

        // Generate token
        const tokenData = { 
            _id: user._id, 
            email: user.email 
        };
        
        if (!process.env.TOKEN_SECRET_KEY) {
            console.error("TOKEN_SECRET_KEY is not defined!");
            return res.status(500).json({
                message: "Server configuration error",
                error: true,
                success: false,
            });
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
            expiresIn: '8h',
        });

        // Debug log
        console.log("Token generated:", token ? "Yes" : "No");

        const tokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Important for cross-site cookies
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : 'localhost',
            maxAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
        };

        // Debug log
        console.log("Cookie options:", tokenOptions);

        res.cookie('token', token, tokenOptions).status(200).json({
            message: "Login successful",
            success: true,
            error: false,
            data: { 
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false,
        });
    }
}
module.exports = userSignInController;