import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Star, Loader2, User, Phone, File } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Swal from 'sweetalert2';
import axios from "axios";

// 1. IMPORT Dashboard from the same folder
import LoginUser from './components/User/LoginUser';
import SignUpUser from './components/User/SignUpUser';


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

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();


    return (
        <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[750px] z-10">
            <BrandSide />
            <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-gray-50/50">
                <div className="max-w-md mx-auto w-full">

                    

                    <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 mb-8 font-medium">Sign in to your account</p>


                    <div className="flex flex-col gap-4">

                        <button
                            disabled={loading}
                            onClick={() => navigate("/signup-user")}
                            className="w-full py-4 rounded-2xl font-black text-lg bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Sign Up as User"}
                        </button>


                    </div>

                    <p className="mt-8 text-center font-bold text-gray-600">Already have an account? <Link to="/" className="text-blue-600 hover:underline">Sign In</Link></p>
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
export default SignUpPage;
