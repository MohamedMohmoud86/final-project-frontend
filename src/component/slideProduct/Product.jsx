import React, { useContext } from 'react'
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaCartArrowDown } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from '../context/CartContext';
import { FaCheck } from "react-icons/fa";
import toast from 'react-hot-toast';

function Product({ item }) {
    const navigate = useNavigate();
    const { cartItems, addToCart, addToFavorites, Favorites, removeFromFavorites } = useContext(CartContext);

    const itemId = item._id || item.id;

    const InCart = cartItems.some(i => (i._id || i.id) === itemId);

    const handleAddToCart = () => {
        addToCart(item);

        const toastImg = item.thumbnail || (item.images && item.images?.length > 0 ? item.images[0] : (item.image || "https://via.placeholder.com/150"));

        toast.success(
            <div className="stoast_wrapper">
                <img src={toastImg} alt={item.title} className='toast_img' />
                <div className="toast_content">
                    <strong>{item.title}</strong> added to cart
                </div>
                <button className='btn' onClick={() => navigate('/Cart')}> View Cart</button>
            </div>, 
            { duration: 3500 }
        );
    };

    const InFav = Favorites.some(i => (i._id || i.id) === itemId);
    
    const handleAddToFav = () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token && !user) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }
        if (InFav) {
            removeFromFavorites(itemId);
            toast.error(`${item.title} Removed From favorites`);
        } else {
            addToFavorites(item);
            toast.success(`${item.title} added To favorites`);
        }
    };

   const mainImage = item.thumbnail || (item.images && item.images?.length > 0 ? item.images[0] : (item.image || "https://via.placeholder.com/150"));

    return (
        <div className={`product ${InCart ? 'in_cart' : ''}`}>
            
            <Link to={`/products/${itemId}`}>
                <span className='ststus_cart'><FaCheck /> in cart</span>

                <div className='img_product'>
              
                    <img 
                        src={mainImage} 
                        alt={item.title || 'product'} 
                        className={String(itemId).length > 10 ? "custom_added_img" : ""}
                    />
                </div>

                <p className='name_product'>{item.title}</p>

                <div className='stars'>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStarHalfStroke />
                </div>

                <p className='price'><span>${item.price}</span></p>
            </Link>
            
            <div className='icons'>
                <span className='btn_addtocart' onClick={handleAddToCart}><FaCartArrowDown /></span>
                <span className={`${InFav ? "in_fav" : ""}`} onClick={handleAddToFav}><FaRegHeart /></span>
                
            </div>
        </div>
    );
}

export default Product;