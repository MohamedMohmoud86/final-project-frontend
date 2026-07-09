import React, { createContext, useEffect, useState } from 'react'

export const CartContext = createContext()

export default function CartProvider({ children }) {


  const getUserId = () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    return currentUser.id || currentUser._id || "guest"; 
  };

  const [currentUserId, setCurrentUserId] = useState(getUserId());

 
  useEffect(() => {
    const checkUserChange = () => {
      const activeId = getUserId();
      if (activeId !== currentUserId) {
        setCurrentUserId(activeId);
        
      
        const savedOrders = localStorage.getItem(`orders_${activeId}`);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);

        const savedFav = localStorage.getItem(`favorites_${activeId}`);
        setFavorites(savedFav ? JSON.parse(savedFav) : []);

        const savedCart = localStorage.getItem(`cartItems_${activeId}`);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
    };

   
    const interval = setInterval(checkUserChange, 1000);
    window.addEventListener('storage', checkUserChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkUserChange);
    };
  }, [currentUserId]);



  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem(`orders_${getUserId()}`);
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const removeOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${currentUserId}`, JSON.stringify(updatedOrders));
  };


 
  const [Favorites, setFavorites] = useState(() => {
    const savedFav = localStorage.getItem(`favorites_${getUserId()}`);
    return savedFav ? JSON.parse(savedFav) : [];
  });

  const addToFavorites = (item) => {
    setFavorites((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((i) => i.id !== id));
  };

  useEffect(() => {
    localStorage.setItem(`favorites_${currentUserId}`, JSON.stringify(Favorites));
  }, [Favorites, currentUserId]);


 
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(`cartItems_${getUserId()}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const clearCart = () => {
    setCartItems([]); 
    localStorage.removeItem(`cartItems_${currentUserId}`); 
  };

  const increaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item._id || item.id) === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item._id || item.id) === id 
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } 
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => 
      prevItems.filter(item => (item._id || item.id) !== id)
    );
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      if (prevItems.some(i => i.id === item.id)) {
        return prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  useEffect(() => {
    localStorage.setItem(`cartItems_${currentUserId}`, JSON.stringify(cartItems));
  }, [cartItems, currentUserId]);


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