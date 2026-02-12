const jwtProvider = require("../utils/jwtProvider");
const UserService = require("../services/UserService");

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get the Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    // 2️⃣ Extract token (Bearer <token>)
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "JWT token is missing" });
    }

    // 3️⃣ Verify the token
    let decoded;
    try {
      decoded = jwtProvider.verifyJwt(token); // throws if invalid
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 4️⃣ Fetch user by email from decoded token
    const user = await UserService.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next(); // pass to next middleware/route handler
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
