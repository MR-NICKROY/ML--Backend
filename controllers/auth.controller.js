const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists with this email"
      });
    }

    // 2️⃣ Decide role automatically
    let role = "USER";
    if (
      name === process.env.ADMIN_NAME &&
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      role = "ADMIN";
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 5️⃣ Create token (AUTO-LOGIN AFTER SIGNUP)
    const token = createToken(user);

    // 6️⃣ Set secure cookie (HTTPS compatible, Dev friendly)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "Signup successful",
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({
      error: "Signup failed",
      details: error.message
    });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  // Extra admin safety
  if (user.role === "ADMIN" && email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: "Admin access denied" });
  }

  const token = createToken(user);

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // ✅ HTTPS only in prod
    sameSite: isProduction ? "none" : "lax", // ✅ "lax" allows localhost HTTP dev
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    message: "Login successful",
    name: user.name,
    email: user.email,
    role: user.role
  });
};


exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  });
  res.json({ message: "Logged out successfully" });
};

exports.me = (req, res) => {
res.status(200).json({
    loggedIn: true,
    userId: req.userId,
    role: req.userRole
  });
};