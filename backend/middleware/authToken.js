// const jwt = require('jsonwebtoken');

// async function authToken(req, res, next) {
//     try {
//         const token = req.cookies?.token; // Get token from cookies

//         console.log("token", token);

//         if (!token) {
//             return res.status(401).json({ // Use 401 for unauthorized access
//                 message: "Please Login...!",
//                 error: true,
//                 success: false
//             });
//         }

//         jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
//             if (err) {
//                 console.error("Error during token verification:", err);
//                 return res.status(403).json({ // Use 403 for forbidden
//                     message: "Invalid or expired token!",
//                     error: true,
//                     success: false
//                 });
//             }

//             req.userId = decoded?._id; // Attach the user ID to the request object for later use
//             next(); // Proceed to the next middleware or route handler
//         });

//     } catch (err) {
//         res.status(500).json({ // Use 500 for server errors
//             message: err.message || "Internal Server Error",
//             data: [],
//             error: true,
//             success: false
//         });
//     }
// }

// module.exports = authToken;


const jwt = require('jsonwebtoken');
async function authToken(req, res, next) {
    try {
        // Check both cookie and Authorization header
        const cookieToken = req.cookies?.token;
        const headerToken = req.headers.authorization?.split(' ')[1];
        const token = cookieToken || headerToken;

        console.log("Auth check - Cookie token:", cookieToken);
        console.log("Auth check - Header token:", headerToken);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
                error: true,
                success: false
            });
        }

        if (!process.env.TOKEN_SECRET_KEY) {
            console.error("TOKEN_SECRET_KEY is not defined in environment!");
            return res.status(500).json({
                message: "Server configuration error",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(403).json({
                    message: "Invalid or expired token",
                    error: true,
                    success: false
                });
            }

            console.log("Token verified successfully for user:", decoded?._id);
            req.userId = decoded?._id;
            req.user = decoded;  // Store full decoded token data
            next();
        });

    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false
        });
    }
}

module.exports =  authToken ;