const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'לקוח לא מחובר.' });
  }

  try {
    const decoded = verifyToken(token);
    req.customerId = decoded.customerId; // ✅ במקום decoded.id
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
