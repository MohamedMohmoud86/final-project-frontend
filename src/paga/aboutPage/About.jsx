


import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdSecurity } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import AboutFooterSection from "../aboutPage/AboutFooterSection";
import { AiOutlineRetweet } from "react-icons/ai";



import "./About.css";
import { Link } from "react-router";

function About() {


  return (
    <>
      <div className="about_page">

        <div className="container">


          <div className="about_info">
            <div className="text">
              <h2>Who We Are</h2>
              <p>
                We are an online store dedicated to providing high-quality products at the best possible prices.
                Our mission is to create a smooth, enjoyable, and reliable shopping experience for every customer.

                We carefully select our products to ensure they meet the highest standards of quality and performance.
                Whether you're looking for the latest trends or everyday essentials, we aim to offer a wide variety of options that suit your needs.

                Customer satisfaction is at the heart of everything we do.
                From fast delivery and secure payment methods to responsive customer support, we strive to make your journey with us simple and stress-free.

                We believe shopping should be more than just buying products — it should be an experience you can trust and enjoy every time.
              </p>
            </div>

            <div className="image">
              <img src="/img/about.jpg" alt="" />
            </div>
          </div>


          <div  className="about_features">
            <div className="box">
              <h3>Fast Delivery</h3>
              <span><CiDeliveryTruck /></span>
              <p>Get your orders quickly</p>
            </div>

            <div className="box">
              <h3>Secure Payment</h3>
              <span><MdSecurity /></span>
              <p>100% safe transactions</p>
            </div>

            <div  className="box">
              <h3>24/7 Support</h3>
              <span><BiSupport /></span>
              <p>We are here for you</p>
            </div>

            <div className="box">
              <h3>Easy Returns</h3>
              <span><AiOutlineRetweet /></span>
              <p>30 days return policy</p>
            </div>
          </div>


          <div className="about_cta">

            <Link className="click" to="/">
              Shop Now </Link>

          </div>

        </div>
      </div>
      <AboutFooterSection />
    </>
  );
}

export default About;