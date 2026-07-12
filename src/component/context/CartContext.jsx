import React, { createContext, useEffect, useState } from 'react'

export const CartContext = createContext()

export default function CartProvider({ children }) {

  
  const getUserId = () => {
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    return currentUser.id || currentUser._id || "guest"; 
  };

  const [currentUserId, setCurrentUserId] = useState(getUserId());


  useEffect(() => {
    setCurrentUserId(getUserId());
  }, []);

  // 📦 1. الـ Orders State
  const [orders, setOrders] = useState(() => {
    const savedOrders = sessionStorage.getItem(`orders_${getUserId()}`);
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const removeOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    sessionStorage.setItem(`orders_${currentUserId}`, JSON.stringify(updatedOrders));
  };

  // ❤️ 2. الـ Favorites State
  const [Favorites, setFavorites] = useState(() => {
    const savedFav = sessionStorage.getItem(`favorites_${getUserId()}`);
    return savedFav ? JSON.parse(savedFav) : [];
  });

  const addToFavorites = (item) => {
    setFavorites((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      const updated = [...prev, item];
      sessionStorage.setItem(`favorites_${currentUserId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      sessionStorage.setItem(`favorites_${currentUserId}`, JSON.stringify(updated));
      return updated;
    });
  };

  // 🛒 3. الـ Cart Items State
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = sessionStorage.getItem(`cartItems_${getUserId()}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const clearCart = () => {
    setCartItems([]); 
    sessionStorage.removeItem(`cartItems_${currentUserId}`); 
  };

  const increaseQuantity = (id) => {
    setCartItems(prevItems => {
      const updated = prevItems.map(item =>
        (item._id || item.id) === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      sessionStorage.setItem(`cartItems_${currentUserId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const decreaseQuantity = (id) => {
    setCartItems(prevItems => {
      const updated = prevItems.map(item =>
        (item._id || item.id) === id 
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } 
          : item
      );
      sessionStorage.setItem(`cartItems_${currentUserId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const updated = prevItems.filter(item => (item._id || item.id) !== id);
      sessionStorage.setItem(`cartItems_${currentUserId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      let updated;
      if (prevItems.some(i => i.id === item.id)) {
        updated = prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...prevItems, { ...item, quantity: 1 }];
      }
      sessionStorage.setItem(`cartItems_${currentUserId}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems,
      addToCart, 
      increaseQuantity, 
      decreaseQuantity, 
      removeFromCart, 
      clearCart, 
      Favorites, 
      addToFavorites, 
      removeFromFavorites, 
      orders, 
      setOrders, 
      removeOrder
    }}>
      {children}
    </CartContext.Provider>
  )
}