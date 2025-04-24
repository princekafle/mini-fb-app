import User from '../models/Usermodel.js';
import bcrypt from 'bcryptjs';
import ResetPassword from "../models/ResetPassword.js";
import { formatUserdata } from "../helpers/dataFormatter.js";
import { createJWT } from "../utils/jwt.js";
import { EMAIL_REGEX, PHONE_REGEX } from "../constants/regex.js";

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
    const { firstName, lastName, identifier, birthDay, birthMonth, birthYear, gender, password, roles } = req.body;

    const hashedPassword = bcrypt.hashSync(password);
    let userData = {
      firstName,
      lastName,
      gender,
      birthDay,
      birthMonth,
      birthYear,
      password: hashedPassword,
      roles: roles || "user",
    };

    if (!identifier) {
      return res.status(422).send("Phone or Email is required.");
    }
    // Basic validations
    if (!firstName || !lastName)
      return res.status(422).send("Name is required.");
    if (!birthDay || !birthMonth || !birthYear)
      return res.status(422).send("Birth data is required.");
    if (!identifier)
      return res.status(422).send("Phone or Email is required.");
    if (!password)
      return res.status(422).send("Password is required.");
    if (!gender)
      return res.status(422).send("Gender is required.");

   const isEmail= EMAIL_REGEX.test(identifier);
   const isphone = PHONE_REGEX.test(identifier);
  
  if (isEmail) {
   userData.email = identifier;
    delete userData.phone; 
  } else if (isphone) {
    userData.phone = identifier;
    delete userData.email;
  } else {
    return res.status(422).send("Not a valid email or phone number format.");
  }

  if (!userData.phone && !userData.email) {
    return res.status(422).send("Phone or Email must be provided.");
  }
  

  Object.entries(userData).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      delete userData[key];
    }
  });
  
  if ('email' in userData && !userData.email) {
    throw new Error("Email still invalid after cleanup");
  }

   
  const searchConditions = [];

  if (userData.email) searchConditions.push({ email: userData.email });
  if (userData.phone) searchConditions.push({ phone: userData.phone });
  
  const existingUser = await User.findOne({ $or: searchConditions });
  
  if (existingUser) return res.status(409).send("User already exists.");


  // if (user) {
  //   throw {
  //     statusCode: 409,
  //     message: "User already exists.",
  //   };
  // }

  

  // console.log(userData)
  console.log('hy guysd')
    // Create user with only necessary fields
      const newUser= await User.create(userData
      );
    // await newUser.save();
    console.log(newUser)

    // return await User.create({
    //   address: data.address,
    //   name: data.name,
    //   phone: data.phone,
    //   email: data.email,
    //   password: hashedPassword,
    //   roles: data.roles,
    // });


    // const formattedData = formatUserdata(newUser);
    const token = createJWT(newUser.toObject());
    res.cookie("authToken", token);
    res.json(newUser);

  } catch (error) {
    res.status(error.statusCode || 500).send(error.message);
  }
};



// LOGOUT
const logout = (_, res) => {
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
