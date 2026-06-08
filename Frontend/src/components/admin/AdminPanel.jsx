import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Star, Loader2, User, Phone, File } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Swal from 'sweetalert2';
import axios from "axios";



// --- PAGE COMPONENTS ---



const AdminPanel = () => {

  const navigate = useNavigate();

  useEffect(() => {

    const adminData = JSON.parse(
      localStorage.getItem("admin")
    );

    // IF ADMIN NOT LOGGED IN
    if (!adminData) {

      navigate("/");

    }

  }, [navigate]);

  const handleLogout = () => {

    // REMOVE STORED DATA
    localStorage.removeItem("admin");

    // OPTIONAL
    sessionStorage.clear();

    // REDIRECT TO LOGIN PAGE
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center rounded-[2.5rem] items-center bg-gray-100 p-6">

      {/* BIG WHITE CARD */}
      <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-[40px] shadow-2xl p-10">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Admin Panel
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-2xl"
          >
            Logout
          </button>

        </div>

        {/* SMALL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* USER CARD */}
          <div
            onClick={() => navigate("/edit-user")}
            className="bg-blue-100 rounded-3xl p-8 cursor-pointer hover:scale-105 hover:bg-green-100 transition-all duration-300 shadow-md"
          >
            <h2 className="text-2xl font-bold mb-3">
              Edit User Details
            </h2>

            <p className="text-gray-600">
              Edit and manage user details
            </p>
          </div>

          

          {/* USER CARD */}
          <div
            onClick={() => navigate("/delete-user")}
            className="bg-red-100 rounded-3xl p-8 cursor-pointer hover:scale-105 hover:bg-cyan-100 transition-all duration-300 shadow-md"
          >
            <h2 className="text-2xl font-bold mb-3">
              Delete User
            </h2>

            <p className="text-gray-600">
              Delete user from portal
            </p>
          </div>





        </div>

      </div>
    </div>
  );
};


// --- MAIN APP ENTRY ---
export default AdminPanel;