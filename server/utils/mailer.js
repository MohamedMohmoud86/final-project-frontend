const sendOTPEmail = async (userEmail, generatedOTP, userName) => {
  try {
    
    const response = await fetch(process.env.GMAIL_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: userEmail,
        subject: "Your OTP Verification Code",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;max-width:500px;margin:auto;border:1px solid #eee;border-radius:10px">
            <h2>Hello ${userName}</h2>
            <p>Your verification code is:</p>
            <h1 style="color:#0d6efd;letter-spacing:6px;font-size:40px;background-color:#f8f9fa;padding:10px;text-align:center;border-radius:5px;">
              ${generatedOTP}
            </h1>
            <p style="color:#dc3545;font-weight:bold;">This code expires in 2 minutes.</p>
          </div>
        `,
      }),
    });

    const resData = await response.json();

    if (resData.status !== "success") {
      throw new Error(resData.message || "Failed to send email via Google Script");
    }

    console.log("✅ Email Sent Successfully via Google Script API!");
    return resData;

  } catch (err) {
    console.error("❌ GOOGLE SCRIPT API ERROR:");
    console.error(err.message || err);
    throw err;
  }
};

module.exports = sendOTPEmail;