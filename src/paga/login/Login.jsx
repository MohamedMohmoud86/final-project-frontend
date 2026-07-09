import { useState } from "react";
import API from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/auth.css";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

   
    if (!email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
     
      const res = await API.post("/login", {
        email: email.trim(),
        password: password
      });

    
      localStorage.setItem("token", res.data.token);

    
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Success");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userFormatted = {
        id: firebaseUser.uid,              
        name: firebaseUser.displayName,         
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL         
      };

      localStorage.setItem("user", JSON.stringify(userFormatted));
      
      localStorage.setItem("auth", JSON.stringify({
        user: userFormatted,
        type: "google"
      }));

      const token = await firebaseUser.getIdToken();
      localStorage.setItem("token", token);

      toast.success("Google Login Success");
      
      window.location.href = "/"; 

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email} 
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password} 
          onChange={handleChange}
          required
        />

        {/* LOGIN BUTTON */}
        <button type="submit">
          Login
        </button>

        {/* GOOGLE LOGIN */}
        <button 
          className="goagle"
          type="button"
          onClick={googleLogin}
        >
          Continue With Google
        </button>

        {/* REGISTER LINK */}
        <p className="auth-switch">
          Don’t have an account?
          <Link to="/register">
            Create New Account
          </Link>
        </p>
      </form>
    </div>
  );
}