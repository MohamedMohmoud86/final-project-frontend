import { useState } from "react";
import API from "../../api/api";
import toast from "react-hot-toast";
import "../../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

  
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }


    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      toast.error("First name and last name must be at least 2 characters");
      return;
    }

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

   
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
     
      const response = await API.post("/register", {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password: password,
      });

      toast.success("OTP Sent To Your Email");

      if (response.data) {
        localStorage.setItem("otp_email", response.data.user.email);
        localStorage.setItem("otp_created_at", response.data.user.otpCreatedAt);
        
        navigate("/verify-otp"); 
      }

    } catch (err) {
      console.log("Register Error:", err.response?.data);
      toast.error(
        err.response?.data?.message || "Register Failed"
      );
      
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <div className="name-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName} 
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email} 
          onChange={handleChange}
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password} 
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <div className="password-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword} 
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}