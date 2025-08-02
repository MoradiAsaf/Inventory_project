require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const username = "admin";
    const password = "admin";
    const full_name = "System Admin";

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log("❌ משתמש עם שם זה כבר קיים");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      full_name
    });

    await newAdmin.save();
    console.log("✅ אדמין נוצר בהצלחה");
    console.log(`🔑 שם משתמש: ${username}`);
    console.log(`🔐 סיסמה: ${password}`);
    process.exit();
  } catch (err) {
    console.error("שגיאה ביצירת אדמין:", err);
    process.exit(1);
  }
};

createAdmin();
