import React, { useEffect, useState } from 'react';
import { IoIosMenu } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';
import {
  PiSignInBold,
  PiSignOutBold
} from "react-icons/pi";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaMoon, FaSun } from "react-icons/fa"; 

const NavLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Accessories", link: "/accessories" },
  { title: "Blog", link: "/blog" },
  { title: "Contact", link: "/contact" },
];

function BtmHeader() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();


  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setIsCategoryOpen(false);
  }, [location]);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    
   
    window.location.href = "/login";
  };

  return (
    <div className='btm_header'>
      <div className='container'>
        <nav className='nav'>
          <div className='category_nav'>
            <div className='category_btn' onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
              <IoIosMenu />
              <p>Browse Category</p>
              <IoMdArrowDropdown />
            </div>

            <div className={`category_nav_list ${isCategoryOpen ? "active" : ""}`} >
              {categories.map((category) => (
                <Link key={category.slug} to={`/category/${category.slug}`}>
                  {category.name}
                </Link>
              ))}
            </div>

            <div className='nav_links'>
              {NavLinks.map((item) => (
                <li key={item.link} className={location.pathname === item.link ? "active" : ""}> 
                  <Link to={item.link}>{item.title}</Link>
                </li>
              ))}
            </div>
          </div>
        </nav>

        
       <div className="sign_regs_icons">
          <div className="auth-icons">
            <Link to="/orders" className='orders_link'>
              <FaBoxOpen /> <span>Orders</span>
            </Link>
          </div>

        

          {user ? (
            <>
           
              <div className="user_profile_nav">
                <span>👋</span>
                <strong>Hi, {user.name ? user.name.split(" ")[0] : "User"}</strong>
              </div>

              
              <div className="orders_link logout_btn" onClick={handleLogout}>
                <PiSignOutBold />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <Link to="/login" className="orders_link">
              <PiSignInBold />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default BtmHeader;