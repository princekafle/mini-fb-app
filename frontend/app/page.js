"use client"
import { useState } from 'react';
// import { Eye, EyeOff } from "react-icons/fi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import './globals.css';
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import toast, { Toaster } from "react-hot-toast";
import { SIGNUP_URL } from "@/constants/routes";
import Link from "next/link";

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { login } = useAuthStore();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ identifier, password });
    console.log(identifier)

    if (res.success) {
      toast.success('Login successful!');
      router.push('/'); // Navigate to home
    } else {
      toast.error(`Invalid credentials. Please try again ${res.message}.`);
    }
  };


  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-28 px-4 py-10 max-w-6xl mx-auto w-full flex-grow">
        {/* Left section - Logo and Recent Logins */}
        <div className="flex flex-col items-center md:items-start max-w-md">
          <h1 className="text-[#035aca] text-4xl md:text-3xl font-bold mb-4">Mini facebook</h1>
          <h2 className="text-xl md:text-2xl mb-2 text-center md:text-left">Recent Logins</h2>
          <p className="text-gray-600 mb-6 text-center md:text-left">Click your picture or add an account.</p>

          <div className="flex gap-4">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-[160px]">
              <div className="w-full h-[140px] bg-gray-200 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                  No Image
                </div>
              </div>
              <div className="p-3 text-center">
                <p className="font-medium">User</p>
              </div>
            </div>

            {/* Add Account Card */}
            <div className="bg-amber-50 rounded-lg shadow-md overflow-hidden w-[160px]">
              <div className="w-full h-[140px] bg-white flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white text-3xl">+</span>
                </div>
              </div>
              <div className="p-3 text-center bg-white ">
                <p className="text-[#1877F2] font-medium">Add Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Login Form */}
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email or phone number"
              className="p-3 text-md border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />


            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="p-3 text-md border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#005dd6] text-white p-3 rounded-md text-md font-bold hover:bg-[#166FE5] transition-colors"
            >
              Log In
            </button>

            <div className="text-center">
              <a href="#" className="text-[#1877F2] text-sm hover:underline">Forgot password?</a>
            </div>

            <div className="border-t border-gray-300 my-2"></div>

            <div className="flex justify-center">
            <Link href={SIGNUP_URL}> <button
                type="button"
                className="bg-[#2bb410] text-white py-3 px-4 rounded-md text-md font-bold hover:bg-[#36A420] transition-colors"
              >
                Create new account
              </button></Link> 
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto py-4 text-center text-sm">
        <a href="#" className="font-bold hover:underline">Create a Page</a>
        <span className="text-gray-600"> for a celebrity, brand or business.</span>
      </div>
    </div>
  );
}

export default Home;
