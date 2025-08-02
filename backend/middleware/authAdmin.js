const jwt = require("jsonwebtoken");
const secretKey = process.env.secret_key;

function authAdminMiddleware(req, res, next) {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: "אין גישה. התחבר כמנהל" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    if (!decoded.adminId) {
      return res.status(403).json({ message: "טוקן אינו של מנהל" });
    }

    req.adminId = decoded.adminId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "טוקן לא תקף או פג תוקף" });
  }
}

module.exports = authAdminMiddleware;
