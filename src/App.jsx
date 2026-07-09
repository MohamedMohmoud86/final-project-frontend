import React, { useEffect, useState } from "react";
import TopHeader from "./component/header/TopHeader";
import BtmHeader from "./component/header/BtmHeader";
import Home from "./paga/home/Home";
import { useLocation, Route, Routes } from "react-router";
import ProductDetails from "./paga/home/ProductDetails/ProductDetails";
import Cart from "./paga/home/cart/Cart";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./component/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import CategoryPage from "./paga/categoryPage/CategoryPage";
import SearchResult from "./paga/SearchResult";
import About from "./paga/aboutPage/About";
import Contact from "./paga/contactPage/Contact";
import Favorites from "./paga/favorites/Favorites";
import Accessories from "./paga/Accessories/Accessories";
import Blog from "./paga/blog/Blog";
import Orders from './paga/Orders/Orders';
import Register from "./paga/register/Register";
import Login from "./paga/login/Login";
import VerifyOtp from "./paga/VerifyOtp";
import PaymentSuccess from "./paga/PaymentSuccess";
import AdminProducts from "./admin/AdminProducts";
import AdminDashboard from "./admin/AdminDashbord";
import AdminContact from "./admin/AdminContact";


import { ProtectedRoute, AdminRoute } from "./component/ProtectedRoute"; 

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(res => setData(res.products));
  }, []);

  return (
    <>
      {!isAdminRoute && (
        <header>
          <TopHeader />
          <BtmHeader />
        </header>
      )}

      <Toaster 
        position="bottom-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#e9e9e9',
            borderRadius: '5px',
            padding: '20px',
          }
        }}
      />

      <div className="App">
        <ScrollToTop />
        <AnimatePresence mode="wait" />

        <Routes>
         
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/accessories" element={<Accessories data={data} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          
         
          <Route 
            path="/admin/contact" 
            element={
              <AdminRoute>
                <AdminContact />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

export default App;