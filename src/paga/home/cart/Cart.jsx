import React, { useState, useContext } from "react";
import { CartContext } from "../../../component/context/CartContext";
import { FaTrashAlt } from "react-icons/fa";
import "./Cart.css";
import PageTransition from "../../../component/PageTransition";

import toast from "react-hot-toast";
import axios from "axios";

const API = "https://final-project-production-3b18.up.railway.app";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const total = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [walletNumber, setWalletNumber] = useState("");

  const handleCheckout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        toast.error("Please login first");
        return;
      }

      if (paymentMethod === "wallet") {
        if (!walletNumber.trim()) {
          toast.error("Please enter your wallet number");
          return;
        }

        if (walletNumber.length !== 11) {
          toast.error("Wallet number must be 11 digits");
          return;
        }
      }

      const savedUser = JSON.parse(localStorage.getItem("user"));

      const currentUserId =
        savedUser?.id || savedUser?.uid || savedUser?._id;

      // Create Order
      const orderRes = await axios.post(`${API}/api/create-order`, {
        userId: currentUserId,
        customerName: savedUser?.name || "Customer",
        customerEmail: savedUser?.email,
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
      });

      const order = orderRes.data;

      // Payment
      const paymentRes = await axios.post(`${API}/api/payment`, {
        amount: Number(total),
        paymentMethod,
        orderIdFromMongo: order?._id || order?.id,
        walletIdentifier:
          paymentMethod === "wallet" ? walletNumber : "",
      });

      if (!paymentRes.data?.iframeURL) {
        throw new Error("Payment URL not found");
      }

      window.location.href = paymentRes.data.iframeURL;
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Payment Failed");
    }
  };

  return (
    <PageTransition>
      <div className="checkout">
        <div className="ordersummary">
          <h1>Order Summary</h1>

          <div className="items">
            {cartItems.length === 0 ? (
              <div className="title">
                <p>Your Cart Is Empty</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div className="item_cart" key={index}>
                  <div className="image_name">
                    <div className="img_item">
                      <img
                        src={
                          item.thumbnail ||
                          (item.images && item.images.length > 0
                            ? item.images[0]
                            : "https://via.placeholder.com/150")
                        }
                        alt={item.title}
                      />
                    </div>

                    <div className="content">
                      <h4>{item.title}</h4>

                      <p className="price_item">
                        ${item.price}
                      </p>

                      <div className="quantity_control">
                        <button
                          onClick={() =>
                            decreaseQuantity(item._id || item.id)
                          }
                        >
                          -
                        </button>

                        <span className="quantity">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item._id || item.id)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item._id || item.id)
                    }
                    className="delete_item"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="bottom_summary">
            <div className="shop_table">
              <p>Total:</p>
              <span className="total_checkout">
                ${total.toFixed(2)}
              </span>
            </div>

            <select
              className="payment_select"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option value="card">Visa / MasterCard</option>
              <option value="wallet">Wallet</option>
            </select>

            {paymentMethod === "wallet" && (
              <input
                type="text"
                placeholder="Wallet Number (e.g. 01012345678)"
                value={walletNumber}
                maxLength={11}
                onChange={(e) =>
                  setWalletNumber(e.target.value)
                }
                className="wallet_input"
              />
            )}

            <div className="button_div">
              <button onClick={handleCheckout}>
                Proceed To Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Cart;