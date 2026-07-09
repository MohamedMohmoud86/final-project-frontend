import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    
    const email = localStorage.getItem("otp_email") || ""; 
    const otpCreatedAt = localStorage.getItem("otp_created_at");

    const [timeLeft, setTimeLeft] = useState(() => {
        
        if (otpCreatedAt) {
            const difference = Date.now() - new Date(otpCreatedAt).getTime();
            const remain = Math.max(0, 120 - Math.floor(difference / 1000));
            return remain;
        }
        return 120; 
    });
    
    const [isExpired, setIsExpired] = useState(timeLeft === 0);
    const navigate = useNavigate();

    
    useEffect(() => {
        if (timeLeft === 0) {
            setIsExpired(true);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    setIsExpired(true);
                    clearInterval(timerId);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (isExpired) {
            setError("This OTP has expired. Please request a new one.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post("https://final-project-production-3b18.up.railway.app/api/verify-otp", { email, otp });
            
           
            toast.success(response.data.message || "Account verified successfully! 🎉");
            
            localStorage.removeItem("otp_email");
            localStorage.removeItem("otp_created_at");
            
            
            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (err) {
            
            const errMsg = err.response?.data?.message || "Something went wrong";
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            setError("Email is missing. Please register again.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await axios.post("https://final-project-production-3b18.up.railway.app/api/resend-otp", { email }); 
            
            
            toast.success(response.data.message || "A new OTP has been sent! 📧");
            
            const newCreatedAt = new Date().toISOString();
            localStorage.setItem("otp_created_at", newCreatedAt);
            
            setTimeLeft(120);
            setIsExpired(false);
            setOtp('');
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to resend OTP";
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify_container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
            <h2>Account Verification</h2>
            <p>Please enter the 6-digit code sent to: <br/> <strong>{email || "your email"}</strong></p>

            <form onSubmit={handleVerify}>
                <input 
                    type="text" 
                    maxLength="6"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isExpired}
                    style={{ display: 'block', width: '100%', padding: '10px', fontSize: '20px', textAlign: 'center', letterSpacing: '5px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
                />

                <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                    {isExpired ? (
                        <span style={{ color: '#ff4757' }}>⏰ Time's up! Code is no longer valid.</span>
                    ) : (
                        <span style={{ color: timeLeft <= 20 ? '#ff4757' : '#0090f0' }}>
                            ⏱️ Time Remaining: {formatTime(timeLeft)}
                        </span>
                    )}
                </div>

                {error && <p style={{ color: '#ff4757', fontSize: '14px' }}>{error}</p>}

                <button 
                    type="submit" 
                    disabled={loading || isExpired || otp.length < 6}
                    style={{ width: '100%', padding: '12px', background: isExpired ? '#ccc' : '#0090f0', color: 'white', border: 'none', borderRadius: '6px', cursor: isExpired ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                >
                    {loading ? "Verifying..." : "Verify Account"}
                </button>
            </form>

            {isExpired && (
                <button 
                    onClick={handleResendOtp}
                    disabled={loading}
                    style={{ background: 'none', border: 'none', color: '#0090f0', textDecoration: 'underline', marginTop: '15px', cursor: 'pointer', fontSize: '14px' }}
                >
                    {loading ? "Sending..." : "Resend Code"}
                </button>
            )}
        </div>
    );
}

export default VerifyOtp;