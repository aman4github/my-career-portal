import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Star, Loader2, User, Phone, File } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from "axios";



// --- SHARED COMPONENTS ---

const BrandSide = () => (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-16 text-white flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="mb-10 p-5 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 animate-[spin_20s_linear_infinite]">
            <Star size={52} className="fill-white text-white" />
        </div>
        <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">
            Smart Career <br /> <span className="text-blue-200">Recommendation Portal</span>
        </h1>
        <p className="text-blue-50 text-lg mb-12 max-w-sm opacity-90">AI-Powered Career Guidance and ATS Optimization.</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md text-center">
            {['99% AI', '95% Success', '10K+ Jobs', '50K+ Users'].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-xs font-bold tracking-widest uppercase">{s}</div>
            ))}
        </div>
    </div>
);


// --- PAGE COMPONENTS ---

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [resetOtpSent, setResetOtpSent] = useState(false);

    const [resetOtp, setResetOtp] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPass, setShowNewPass] = useState(false);

    const [showConfirmPass, setShowConfirmPass] = useState(false);

    

    const navigate = useNavigate();



    const sendForgotPasswordOtp = async () => {

        try {

            const showLoading = () => {
                Swal.fire({
                    text: 'Please Wait We are generating OTP for You...Do not Refresh or Back the Page',
                    icon: 'success',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                })
            }
            showLoading();

            setLoading(true);

            await axios.post(
                `http://localhost:8090/management/user/send-reset-otp?email=${email}`
            );

            setResetOtpSent(true);

            await Swal.fire({
                icon: "success",
                title: "Reset OTP Sent To Email"
            });

        } catch (error) {

            console.log(error);

            await Swal.fire({
                icon: "error",
                title: "Email Not Found"
            });

        } finally {

            setLoading(false);
        }
    };


    const resetPassword = async () => {

        if (newPassword.length < 6) {

            Swal.fire({
                icon: "error",
                title: "Password Must Be At Least 6 Characters"
            });

            return;
        }

        if (newPassword !== confirmPassword) {

            Swal.fire({
                icon: "error",
                title: "Passwords Do Not Match"
            });

            return;
        }

        try {

            setLoading(true);

            await axios.post(
                "http://localhost:8090/management/user/reset-password",
                {
                    email,
                    otp: resetOtp,
                    newPassword
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Password Updated Successfully"
            });

            navigate("/login-user");

        } catch (error) {

            console.log(error);

            await Swal.fire({
                icon: "error",
                title: "Invalid OTP"
            });

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[750px] z-10">
            <BrandSide />
            <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-gray-50/50">
                <div className="max-w-md mx-auto w-full">



                    <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 mb-8 font-medium">Sign in to your account</p>
                    <form className="space-y-5">

                        <div className="relative">

                            <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={20}
                            />

                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-blue-500 transition-all bg-white"
                                placeholder="Email Address"
                            />

                        </div>

                        {
                            !resetOtpSent ? (

                                <button
                                    type="button"
                                    onClick={sendForgotPasswordOtp}
                                    className="w-full py-4 rounded-2xl font-black text-lg bg-orange-600 text-white"
                                >
                                    Send OTP
                                </button>

                            ) : (

                                <div className="space-y-4">

                                    <input
                                        type="text"
                                        value={resetOtp}
                                        onChange={(e) => setResetOtp(e.target.value)}
                                        placeholder="Enter OTP"
                                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-blue-500"
                                    />

                                    <div className="relative">

                                        <input
                                            
                                            type={showNewPass ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New Password"
                                            className="w-full px-4 py-4 pr-12 rounded-2xl border-2 border-gray-100 outline-none focus:border-blue-500"
                                        />

                                        <button
                                            type="button"
                                            
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                        >
                                            {
                                                showNewPass
                                                    ? <EyeOff size={20} />
                                                    : <Eye size={20} />
                                            }
                                        </button>

                                    </div>

                                    <div className="relative">

                                        <input
                                            
                                            type={showConfirmPass ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm Password"
                                            className="w-full px-4 py-4 pr-12 rounded-2xl border-2 border-gray-100 outline-none focus:border-blue-500"
                                        />

                                        <button
                                            type="button"
                                            
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                        >
                                            {
                                                showConfirmPass
                                                    ? <EyeOff size={20} />
                                                    : <Eye size={20} />
                                            }
                                        </button>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={resetPassword}
                                        className="w-full py-4 rounded-2xl font-black text-lg bg-green-600 text-white"
                                    >
                                        Reset Password
                                    </button>

                                </div>
                            )
                        }

                    </form>
                    
                    <p className="mt-8 text-center font-bold text-gray-600">Login with credentials? <Link to="/login-user" className="text-blue-600 hover:underline">Click Here</Link></p>
                </div>
                <div className="mb-6 mt-8 flex items-center justify-center">

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                    >
                        ← Back to Home
                    </button>

                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ENTRY ---
export default ForgetPassword;