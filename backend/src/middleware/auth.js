const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

/**
 * Express middleware to verify JWT and attach user information to the request.
 * If the token is missing or invalid, responds with 401 Unauthorized.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación requerido' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

/**
 * Middleware generator to restrict access based on user roles. The user's role
 * must be present in the decoded JWT payload (property `role`).
 *
 * @param {...string} roles Allowed roles (e.g. 'student', 'trainer', 'admin')
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No autorizado para este recurso' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };