import mongoose from "mongoose";
import { EMAIL_REGEX, PHONE_REGEX } from "../constants/regex.js";



  const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

   email: {
      type: String,
      // unique: true,
    
      lowercase: true,
      sparse: true,
      validate: {
        validator: (value) => {
          return EMAIL_REGEX.test(value);
        },
        message: "Invalid email address",
      },
    },
    phone: {
      type: String,
      // unique: true,
      sparse: true,
      validate: {
        validator: (value) => {
          return PHONE_REGEX.test(value);
        },
        message: "Invalid phone number",
      },

     
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    
    birthMonth: {
      type: String,
      enum: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      required: true
    },
    birthDay: {
      type: String,
      required: true
    },
    birthYear: {
      type: String,
      required: true
    },
  gender: {
    type: String,
    enum: ["Male", "Female", "Custom"],
    required: true
  },

  address: {
    city: {
      type: String,
      
    },
    country: {
      type: String,
      default: "Nepal",
    },
    province: String,
    street: String,
  },

  profileImageUrl: String,
  roles: {
    type: [String],
    default: "user",
    enum: ["user", "admin", "merchant"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

    const model = mongoose.model("User", userSchema);
    export default model;
// yaha hamile user ko schema banako xa jasma chai name, address, email, password, profileImageUrl, roles, createdAt vanne field haru xa