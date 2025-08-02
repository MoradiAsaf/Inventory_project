const jwt = require("jsonwebtoken");
const secretKey = process.env.secret_key;

// לקוחות
const generateToken = (customerId) => {
  return jwt.sign({ customerId }, secretKey, { expiresIn: '1h' });
};

// מנהלים
const generateAdminToken = (adminId) => {
  return jwt.sign({ adminId }, secretKey, { expiresIn: '1h' });
};

// אימות כללי (לקוח או מנהל)
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  generateToken,
  generateAdminToken,
  verifyToken
};
