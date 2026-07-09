const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user" 
},

password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
},

  otp: {
    type: String,
    default: ""
},
otpCreatedAt: {
    type: Date,
    default: null 
},

  isVerified: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("User", userSchema);