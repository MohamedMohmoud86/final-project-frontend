const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { body, validationResult } = require("express-validator");

router.post(
  "/contact",
  [
    // 🌟 تم حذف الـ subject تماماً ليتوافق مع تصميم الفرونت إند
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().normalizeEmail().isEmail().withMessage("Invalid email address"),
    body("message").trim().notEmpty().withMessage("Message cannot be empty"), // جعلناها مرنة بدون حد أدنى للحروف
  ],
  async (req, res) => {
    // التحقق من الأخطاء
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // 🌟 نستقبل الحقول القادمة من الفرونت إند فقط
      const { name, email, message } = req.body;
      
      // 🌟 نضع قيمة افتراضية للـ subject هنا لحماية الموديل إذا كان إجبارياً في المونجو
      const newUpdate = new Contact({ 
        name, 
        email, 
        subject: "Contact Us Message", 
        message 
      });
      
      await newUpdate.save();
      
      return res.status(201).json({ message: "Your message has been sent successfully! 🎉" });
    } catch (err) {
      console.error("❌ Contact Us Error:", err.message);
      return res.status(500).json({ message: "Server error, failed to send message" });
    }
  }
);

// باقي الراوتس بدون تغيير وسليمة 100%
router.get("/admin/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

router.delete("/admin/contact/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

module.exports = router;