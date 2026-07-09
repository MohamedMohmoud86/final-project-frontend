const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
require("dotenv").config();
const Order = require("./models/Order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const orderRoutes = require("./routes/orderRoutes");
const User = require("./models/User");
const Notification = require("./models/Notification"); 
const Contact = require("./models/Contact"); 

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator"); 
const app = express();
const sendOTPEmail = require("./utils/mailer");

app.use(cors({
  origin: ["http://localhost:3000", "https://final-project-production-3b18.up.railway.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json()); 

const cleanNoSQLInjection = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        cleanNoSQLInjection(obj[key]);
      }
    }
  }
};
app.use((req, res, next) => {
  if (req.body) cleanNoSQLInjection(req.body);
  if (req.query) cleanNoSQLInjection(req.query);
  if (req.params) cleanNoSQLInjection(req.params);
  next();
});

app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
  validate: { trustProxy: false } 
});
app.use("/api", apiLimiter);


app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes); 


app.post(
  "/api/contact", 
  [
    body("name").trim().notEmpty().withMessage("Name is required and cannot be empty"),
    body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
    body("message").isLength({ min: 10 }).withMessage("Message must be at least 10 characters long")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, message } = req.body;

     
      const newDoc = await Contact.create({ 
        name, 
        email, 
        subject: "Contact Us Message", 
        message 
      });
      console.log(`📩 Message saved to DB from: ${name} (ID: ${newDoc._id})`);

      return res.status(200).json({ 
        success: true,
        message: "Your message has been received successfully! Thank you." 
      });
    } catch (err) {
      console.error("DATABASE SAVE ERROR:", err);
      return res.status(500).json({ 
        message: "Failed to save your message. Internal Server Error."
      });
    }
  }
);

const authMiddleware = require("./middleware/authMiddleware");

/* =========================
      PROTECTED ROUTE
========================= */
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      message: "Protected data accessed",
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
       DB CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


/* =========================
      REGISTER API
========================= */
app.post(
  "/api/register", 
  [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").trim().normalizeEmail().isEmail().withMessage("Please enter a valid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ],
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      const generatedOTP = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp: generatedOTP,
        otpCreatedAt: Date.now(),
        isVerified: false,
      });

      
      try {
        await sendOTPEmail(user.email, generatedOTP, user.name);
      } catch (mailErr) {
        console.error("❌ Mailer Error Logging:", mailErr.message);
       
      }

      return res.status(200).json({
        message: "User registered successfully",
        user: {
          email: user.email,
          otpCreatedAt: user.otpCreatedAt,
        },
      });

    } catch (err) {
      console.error(" REGISTER CRASH ERROR:", err);
      return res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    }
  }
);

/* =========================
       VERIFY OTP API
========================= */
app.post(
  "/api/verify-otp", 
  [
    body("email").trim().normalizeEmail().isEmail().withMessage("Valid email is required"),
    body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits").isNumeric().withMessage("OTP must contain numbers only")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.otpCreatedAt) {
        return res.status(400).json({ message: "No OTP requested or code already used" });
      }

      const currentTime = Date.now();
      const otpTime = new Date(user.otpCreatedAt).getTime();
      const timeDifference = currentTime - otpTime; 

      const twoMinutes = 2 * 60 * 1000; 

      if (timeDifference > twoMinutes) {
        user.otp = "";
        user.otpCreatedAt = null;
        await user.save();

        return res.status(400).json({ 
          message: "OTP has expired! Please request a new one." 
        });
      }

      if (String(user.otp) !== String(otp)) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      user.isVerified = true;
      user.otp = "";
      user.otpCreatedAt = null; 

      await user.save();

      res.json({
        message: "Account verified successfully"
      });

    } catch (err) {
      res.status(500).json(err);
    }
  }
);


/* =========================
       RESEND OTP API
========================= */
app.post(
  "/api/resend-otp", 
  [
    body("email").trim().normalizeEmail().isEmail().withMessage("Please provide a valid email address")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const generatedOTP = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      user.otp = generatedOTP;
      user.otpCreatedAt = Date.now(); 
      await user.save();

      const sendOTPEmail = require("./utils/mailer");
      await sendOTPEmail(user.email, generatedOTP, user.name);

      res.json({
        message: "A new OTP has been sent successfully to your email!"
      });

    } catch (err) {
      console.error("❌ Resend OTP Error:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


/* =========================
            LOGIN API 
========================= */
app.post(
  "/api/login", 
  [
    body("email").trim().normalizeEmail().isEmail().withMessage("Please enter a valid email address"),
    body("password").notEmpty().withMessage("Password field cannot be empty")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          message: "Please verify your account first"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials"
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        "secretKey",
        { expiresIn: "1d" }
      );

      try {
        await Notification.create({
          userId: user._id, 
          title: "Welcome Back! 👋",
          message: `Hello ${user.name}, you have successfully logged in.`
        });
      } catch (notifErr) {
        console.error(" Failed to create login notification:", notifErr.message);
      }

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (err) {
      res.status(500).json(err);
    }
  }
);




/* =========================
          ORDERS API 
========================= */
app.post("/api/create-order", async (req, res) => {
  try {
    const { userId, customerName, customerEmail, products, total } = req.body;

    const order = await Order.create({
      userId,
      customerName,
      customerEmail,
      products,
      totalPrice: total,
      paymentStatus: "Pending",
    });

    if (order && order.userId) {
      try {
        await Notification.create({
          userId: order.userId, 
          title: "Order Placed! 📦",
          message: `Your order for $${total} has been placed successfully. Please complete your payment.`
        });
        console.log(` Order notification created for user: ${order.userId}`);
      } catch (notifErr) {
        console.error(" Failed to create order notification:", notifErr.message);
      }
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Order Failed",
    });
  }
});




app.delete("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id); 
    console.log(`${id}`);
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/orders/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus: "paid", status: "Confirmed" },
      { new: true }
    );
   
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
        DASHBOARD STATS API 
========================= */
app.get("/api/admin/dashboard-stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await mongoose.model("Product").countDocuments(); 
    const allOrders = await Order.find({});
    
    const totalOrders = allOrders.length;

    let totalRevenue = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let processingCount = 0;

    allOrders.forEach(order => {
      if (order.paymentStatus === "paid" || order.status === "Confirmed") {
        totalRevenue += order.totalPrice || order.total || 0;
      }

      const status = (order.paymentStatus || "Pending").toLowerCase();
      if (status === "paid" || order.status === "Confirmed") completedCount++;
      else if (status === "pending") pendingCount++;
      else processingCount++;
    });

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

    const chartData = [
      { name: "Jan", revenue: totalRevenue * 0.1 },
      { name: "Feb", revenue: totalRevenue * 0.15 },
      { name: "Mar", revenue: totalRevenue * 0.2 },
      { name: "Apr", revenue: totalRevenue * 0.25 },
      { name: "May", revenue: totalRevenue * 0.3 },
      { name: "Jun", revenue: totalRevenue }
    ];

    res.status(200).json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts
      },
      statusDistribution: [
        { name: "Completed", value: completedCount },
        { name: "Pending", value: pendingCount },
        { name: "Processing", value: processingCount }
      ],
      chartData,
      recentOrders
    });

  } catch (err) {
    console.error("🔥 Stats API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


/* =========================
           PAYMENT API 
========================= */
const axios = require("axios");

app.post("/api/payment", async (req, res) => {
  try {
    const { amount, paymentMethod, walletIdentifier, orderIdFromMongo } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const integrationId =
      paymentMethod === "wallet"
        ? process.env.PAYMOB_WALLET_INTEGRATION_ID
        : process.env.PAYMOB_CARD_INTEGRATION_ID;

    const authRes = await axios.post("https://accept.paymob.com/api/auth/tokens", {
      api_key: process.env.PAYMOB_API_KEY,
    });
    const token = authRes.data.token;

    const orderRes = await axios.post("https://accept.paymob.com/api/ecommerce/orders", {
      auth_token: token,
      delivery_needed: "false",
      amount_cents: Math.round(amount * 100),
      currency: "EGP",
      merchant_order_id: orderIdFromMongo, 
      items: [],
    });
    const orderId = orderRes.data.id;

    const paymentKeyRes = await axios.post("https://accept.paymob.com/api/acceptance/payment_keys", {
      auth_token: token,
      amount_cents: Math.round(amount * 100),
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: "NA", email: "test@test.com", floor: "NA", first_name: "Mohamed",
        street: "NA", building: "NA", city: "Cairo", country: "EG", last_name: "Mahmoud", state: "Cairo",
        phone_number: walletIdentifier || "+201227092766",
      },
      currency: "EGP",
      integration_id: integrationId,
    });
    const paymentToken = paymentKeyRes.data.token;

    let iframeURL = "";
    if (paymentMethod === "card") {
      const iframeId = process.env.PAYMOB_IFRAME_ID;
      if (!iframeId) return res.status(500).json({ message: "PAYMOB_IFRAME_ID is missing" });
      iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;
    } else if (paymentMethod === "wallet") {
      const testWalletNumber = "+201010101010"; 
      const walletRes = await axios.post("https://accept.paymob.com/api/acceptance/payments/pay", {
        source: { identifier: testWalletNumber, subtype: "WALLET" },
        payment_token: paymentToken,
      });

      iframeURL = walletRes.data.iframe_redirection_url || walletRes.data.pending_url;
      if (!iframeURL || iframeURL.includes("error_occured=true") || iframeURL.includes("Receiver+is+not+registered")) {
         iframeURL = `https://accept.paymobsolutions.com/api/acceptance/wallet/other/test/wallet_template?payment_token=${paymentToken}`;
      }
    }
    
    return res.json({ iframeURL });

  } catch (err) {
    console.error("PAYMENT ERROR:", err.response?.data || err);
    return res.status(500).json({ message: "Payment Failed", error: err.message });
  }
});


app.get("/api/payment/callback", async (req, res) => {
  console.log( req.query);
  
  const success = req.query.success;
  const mongoOrderId = req.query.merchant_order_id || req.query.order || req.query.id;

  if (success === "true" || success === true) {
    try {
      if (mongoOrderId && mongoOrderId !== "undefined") {
        let order = await Order.findOne({
          $or: [
            { _id: mongoose.Types.ObjectId.isValid(mongoOrderId) ? mongoOrderId : null },
            { merchant_order_id: mongoOrderId },
            { paymobOrderId: mongoOrderId } 
          ].filter(condition => Object.values(condition)[0] !== null) 
        });

        if (!order && mongoose.Types.ObjectId.isValid(mongoOrderId)) {
          order = await Order.findById(mongoOrderId);
        }

        if (order) {
          order.paymentStatus = "paid";
          order.status = "Confirmed";
          await order.save();

          console.log(`${order.userId}`);

          await Notification.create({
            userId: order.userId, 
            title: "Payment Successful! 🎉",
            message: `Your order for $${order.totalPrice || order.total || 0} has been successfully paid and confirmed.`
          });
          console.log(` ${order.userId}`);
        } else {
          console.log(mongoOrderId);
        }
      }
      
      return res.redirect("http://localhost:3000/orders?success=true&merchant_order_id=" + mongoOrderId);

    } catch (err) {
      console.error( err.message);
      return res.redirect("http://localhost:3000/orders?success=true&merchant_order_id=" + mongoOrderId);
    }
  } else {
    return res.redirect("http://localhost:3000/orders?success=false");
  }
});


/* =========================
     NOTIFICATION SYSTEM
========================= */
app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }); 
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/read-all/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, isRead: false },
      { isRead: true }
    );
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


/* =========================
        CONTACT US ROUTE
========================= */



app.post(
  "/api/contact", 
  [
    body("name").trim().notEmpty().withMessage("Name is required and cannot be empty"),
    body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
    body("message").isLength({ min: 10 }).withMessage("Message must be at least 10 characters long")
  ],
  async (req, res) => {
    
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, message } = req.body;

      const newDoc = await Contact.create({ name, email, message });
      console.log(` Message saved to DB from: ${name} (ID: ${newDoc._id})`);

      return res.status(200).json({ 
        success: true,
        message: "Your message has been received successfully! Thank you." 
      });
    } catch (err) {
      console.error("DATABASE SAVE ERROR:", err);
      return res.status(500).json({ 
        message: "Failed to save your message. Internal Server Error."
      });
    }
  }
);


/* =========================
          SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});