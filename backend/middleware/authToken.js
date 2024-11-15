const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token; // Get token from cookies

        console.log("token", token);

        if (!token) {
            return res.status(401).json({ // Use 401 for unauthorized access
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("Error during token verification:", err);
                return res.status(403).json({ // Use 403 for forbidden
                    message: "Invalid or expired token!",
                    error: true,
                    success: false
                });
            }

            req.userId = decoded?._id; // Attach the user ID to the request object for later use
            next(); // Proceed to the next middleware or route handler
        });

    } catch (err) {
        res.status(500).json({ // Use 500 for server errors
            message: err.message || "Internal Server Error",
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
