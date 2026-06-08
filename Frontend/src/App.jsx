import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Star, Loader2, User, Phone, File } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Swal from 'sweetalert2';
import axios from "axios";

// 1. IMPORT Dashboard from the same folder
import Dashboard from './components/features/Dashboard';
import ResumeMaker from './components/features/ResumeMaker'; // Ensure the file name matches exactly
import SkillUpgradation from './components/features/SkillUpgradation';
import MockInterview from './components/features/MockInterview';

import LoginUser from './components/User/LoginUser';

import LoginAdmin from './components/admin/LoginAdmin';

import SignUpPage from './SignUpPage';
import SignUpUser from './components/User/SignUpUser';
import ForgotPassword from './components/User/ForgotPassword';
import AdminPanel from './components/admin/AdminPanel';
import EditUser from './components/admin/EditUser';
import DeleteUser from './components/admin/DeleteUser';
import UpdateUser from './components/admin/UpdateUser';
import ProfileUpdate from './components/User/ProfileUpdate';


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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();


  const handleEmailLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:8090/management/userlogin",
        {
          email: email,
          password: password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log(response.data);

      await Swal.fire({
        icon: "success",
        title: "Login Successful"
      });

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      await Swal.fire({
        icon: "error",
        title: "Invalid Credentials"
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
          

          <div className="flex flex-col gap-4">

            <button
              disabled={loading}
              onClick={() => navigate("/login-user")}
              className="w-full py-4 rounded-2xl font-black text-lg bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login as User"}
            </button>

            

            <button
              disabled={loading}
              onClick={() => navigate("/login-admin")}
              className="w-full py-4 rounded-2xl font-black text-lg bg-red-600 text-white flex items-center justify-center gap-2 hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login as Admin"}
            </button>

          </div>

          <p className="mt-8 text-center font-bold text-gray-600">Don't have an account? <Link to="/signup-page" className="text-blue-600 hover:underline">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};



// --- MAIN APP ENTRY ---
export default function App() {
  return (
    <Router>
      {/* Main Wrapper - relative lets absolute children stay inside */}
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1e40af] p-4 relative overflow-hidden font-sans">

        {/* 1. BACKGROUND BLOBS - Added z-0 to keep them at the back */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[120px] z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[120px] z-0"></div>

        {/* 2. THE CONTENT - Added z-10 and relative to stay in front */}
        <div className="relative z-10 w-full flex justify-center">
          <Routes>
            {/* <Route path="/index" element={<Index />} /> */}


            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/edit-user" element={<EditUser />} />
            <Route path="/delete-user" element={<DeleteUser />} />
            <Route path="/update-user/:id" element={<UpdateUser />} />


            <Route path="/" element={<LoginPage />} />
            <Route path="/login-user" element={<LoginUser />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup-page" element={<SignUpPage />} />
            <Route path="/signup-user" element={<SignUpUser />} />
            <Route path="/profile-update/:id" element={<ProfileUpdate />} />
            
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume-maker" element={<ResumeMaker />} />
            <Route path="/upgradation" element={<SkillUpgradation />} />
            <Route path="/mock-interview" element={<MockInterview />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}