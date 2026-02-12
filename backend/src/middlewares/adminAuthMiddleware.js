// Admin auth middleware: verifies JWT, loads user and enforces admin role
const UserService = require('../services/UserService');
const jwtProvider = require('../utils/jwtProvider');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'jwt token is missing' });
    }

    // Use UserService to fetch user by token (this will throw if not found)
    const user = await UserService.findUserProfileByJwt(token);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;

    if (req.user && req.user.role === 'ROLE_ADMIN') {
      return next();
    }

    return res.status(401).json({ message: 'Admin access denied' });
  } catch (error) {
    console.error('Error in adminAuthMiddleware:', error.message || error);
    return res.status(401).json({ message: error.message || 'Unauthorized' });
  }
};
 