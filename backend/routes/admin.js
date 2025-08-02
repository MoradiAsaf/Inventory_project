const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const { generateAdminToken } = require('../utils/jwtUtils');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
    }

    // עדכון זמן התחברות אחרון
    admin.last_login = new Date();
    await admin.save();

    const token = generateAdminToken(admin._id);
    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 3600000 // שעה
    });

    res.status(200).json({ message: "התחברת בהצלחה", admin: { _id: admin._id, full_name: admin.full_name } });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "שגיאה פנימית", error: err.message });
  }
});

module.exports = router;
