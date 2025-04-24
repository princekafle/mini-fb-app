import User from '../models/Usermodel.js';
import bcrypt from 'bcryptjs';
import ResetPassword from "../models/ResetPassword.js";
import { formatUserdata } from "../helpers/dataFormatter.js";
import { createJWT } from "../utils/jwt.js";
import { PASSWORD_REGEX } from "../constants/regex.js";

// LOGIN
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).send("Email or phone is required.");
    }
    if (!password) {
      return res.status(400).send("Password is required.");
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(400).send("Invalid credentials or user not found.");
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).send("Incorrect email or password.");
    }

    const formattedData = formatUserdata(user);
    const token = createJWT(formattedData);
    res.cookie("authToken", token);
    res.json(formattedData);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

// REGISTER
const register = async (req, res) => {
  try {
    const { address, email, name, phone, password, confirmPassword } = req.body;

    if (!address?.city) return res.status(422).send("Address is required.");
    if (!email) return res.status(422).send("Email is required.");
    if (!name) return res.status(422).send("Name is required.");
    if (!phone) return res.status(422).send("Phone is required.");
    if (!password) return res.status(422).send("Password is required.");
    if (!confirmPassword) return res.status(422).send("Confirm password is required.");
    if (password !== confirmPassword) return res.status(422).send("Passwords do not match.");

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(422).send("Password must be at least 8 characters with upper/lowercase and numbers.");
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    const hashedPassword = bcrypt.hashSync(password);

    const newUser = await User.create({
      email,
      address,
      password: hashedPassword,
      name,
      phone,
      roles: req.body.roles || [],
    });

    const formattedData = formatUserdata(newUser);
    const token = createJWT(formattedData);
    res.cookie("authToken", token);
    res.json(formattedData);
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully." });
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.status(422).send("Email is required.");

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit

    await ResetPassword.create({
      userId: user._id,
      token: otp,
    });

    res.json({ message: "Reset password link has been sent!" });
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const token = req.query.token;
  const userId = req.params.userId;

  if (!password) return res.status(422).send("Password is required.");
  if (!confirmPassword) return res.status(422).send("Confirm password is required.");
  if (password !== confirmPassword) return res.status(422).send("Passwords do not match.");

  try {
    const resetEntry = await ResetPassword.findOne({
      userId,
      expiresAt: { $gt: Date.now() },
    });

    if (!resetEntry || resetEntry.token !== token) {
      return res.status(400).send("Invalid or expired token.");
    }

    if (resetEntry.isUsed) {
      return res.status(400).send("Token has already been used.");
    }

    const hashedPassword = bcrypt.hashSync(password);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    await ResetPassword.findByIdAndUpdate(resetEntry._id, {
      isUsed: true,
    });

    res.json({ message: "Password reset successful." });
  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};

export { login, register, logout, forgotPassword, resetPassword };
