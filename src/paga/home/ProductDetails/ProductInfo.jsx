import React, { useContext } from 'react'
import { FaRegHeart, FaShare, FaStar } from 'react-icons/fa'
import { FaRegStarHalfStroke } from 'react-icons/fa6'
import { TiShoppingCart } from 'react-icons/ti'
import { CartContext } from '../../../component/context/CartContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

function ProductInfo({ product }) {

    const navigate = useNavigate();

    const {
        cartItems,
        addToCart,
        removeFromFavorites,
        Favorites,
        addToFavorites
    } = useContext(CartContext);

  
    const productId = product?._id || product?.id;

    const InCart = cartItems.some(i => (i._id || i.id) === productId);
    const InFav = Favorites.some(i => (i._id || i.id) === productId);

    // =====================
    // ADD TO CART
    // =====================
    const handleAddToCart = () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token && !user) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        addToCart(product);

       
        const toastImg = product?.thumbnail || (product?.images && product?.images?.length > 0 ? product.images[0] : "https://via.placeholder.com/150");

        toast.success(
            <div className="stoast_wrapper">
                <img src={toastImg} alt={product?.title || 'product'} className='toast_img' />

                <div className="toast_content">
                    <strong>{product?.title}</strong> added to cart
                </div>

                <button className='btn' onClick={() => navigate('/Cart')}>
                    View Cart
                </button>
            </div>,
            { duration: 3500 }
        );
    };

    // =====================
    // ADD TO FAVORITES
    // =====================
    const handleAddToFav = () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token && !user) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        if (InFav) {
            removeFromFavorites(productId);
            toast.error(`${product?.title} Removed From favorites`);
        } else {
            addToFavorites(product);
            toast.success(`${product?.title} added To favorites`);
        }
    };

    return (
        <div className='details_item'>
            <h1 className='name'>{product?.title}</h1>

            <div className='stars'>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaRegStarHalfStroke />
            </div>

            <p className='price'>$ {product?.price}</p>

          
            <h2>
                Availability: 
                <span>{product?.availabilityStatus || (product?.stock > 0 ? "In Stock" : "Out of Stock")}</span>
            </h2>

            <h5>
                Brand: 
                <span>{product?.brand || "Generic"}</span>
            </h5>

            <p className='desc'>
                {product?.description}
            </p>

            <h5 className='stock'>
                <span>
                    {product?.stock > 0 
                      ? `Hurry Up! Only ${product?.stock} Products Left In Stock` 
                      : "Out of Stock"}
                </span>
            </h5>

        
            <button
                onClick={handleAddToCart}
                className={`btn ${InCart ? 'in_cart' : ''}`}
            >
                {InCart ? "Item in cart" : "Add to cart"}
                <TiShoppingCart />
            </button>

            {/* ICONS */}
            <div className='icons'>
                <span
                    className={`${InFav ? "in_fav" : ""}`}
                    onClick={handleAddToFav}
                >
                    <FaRegHeart />
                </span>

                <span>
                    <FaShare />
                </span>
            </div>
        </div>
    );
}

export default ProductInfo;