import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../img/logo.png'

import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import './header.css'
import { CartContext } from '../context/CartContext';
import SearchBox from './SearchBox';


import NotificationBell from '../notification/NotificationBell'; 

function TopHeader() {
    const { cartItems, Favorites } = useContext(CartContext);

    const userString = localStorage.getItem("user");
    const savedUser = userString ? JSON.parse(userString) : null;
   const userId = savedUser?.id || savedUser?.uid || savedUser?._id;

   console.log(userId);
    return (
        <div className='top_header'>
            <div className='container'>
               <Link to="/" > <img src={Logo} alt='Logo'/></Link>

               <SearchBox />

                <div className='header_icons'>
                    
                    
                   
<div className='icon' style={{ cursor: 'pointer' }}>
    <NotificationBell userId={userId} />
</div>

                    
                    <div className='icon'>
                        <Link to="/favorites">
                            <FaHeart />
                            <span className='count'>{Favorites.length}</span>
                        </Link>
                    </div>

                    
                    <div className='icon'>
                        <Link to="/cart">
                            <FaCartShopping />
                            <span className='count'>{cartItems.length}</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TopHeader