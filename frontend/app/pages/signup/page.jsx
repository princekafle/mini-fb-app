"use client"
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Signup = () => {
  const { signup} = useAuthStore();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identifier, setidentifier] = useState("");
  const [password, setPassword] = useState("");
  const [birthMonth, setBirthMonth] = useState("Apr");
  const [birthDay, setBirthDay] = useState("23");
  const [birthYear, setBirthYear] = useState("1992");
  const [gender, setGender] = useState("Male");

  // Generate options for dropdown selects
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i)); 


  const handleSubmit =  async(e) => {
    e.preventDefault();

    const response = await signup({firstName, lastName,birthDay, birthMonth,birthYear,gender,identifier,password})
    if(response.success){
      toast.success('user created successfully'  );
      router.push('/');
    
    }
    else{
      toast.error(`Error backedn: ${response}.message`)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-20">
      {/* Facebook Logo */}
      <div className="text-center mb-4">
        <h1 className="text-[#1877F2] text-6xl font-bold">facebook</h1>
      </div>
      
      {/* Sign-up Form */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">Create a new account</h2>
          <p className="text-gray-600">It's quick and easy.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2 w-full"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2 w-full"
            />
          </div>
          
          {/* Birthday */}
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-sm text-gray-600">Birthday</span>
              <span className="ml-1 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="flex gap-2">
              <select 
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2 bg-white"
              >
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              
              <select 
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2 bg-white"
              >
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              
              <select 
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2 bg-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Gender */}
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-sm text-gray-600">Gender</span>
              <span className="ml-1 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="flex gap-2">
              <label className="flex-1 border border-gray-300 rounded p-2 flex items-center justify-between">
                <span>Female</span>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={() => setGender("Female")}
                  className="ml-2"
                />
              </label>
              
              <label className="flex-1 border border-gray-300 rounded p-2 flex items-center justify-between">
                <span>Male</span>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={() => setGender("Male")}
                  className="ml-2"
                />
              </label>
              
              <label className="flex-1 border border-gray-300 rounded p-2 flex items-center justify-between">
                <span>Custom</span>
                <input
                  type="radio"
                  name="gender"
                  value="Custom"
                  checked={gender === "Custom"}
                  onChange={() => setGender("Custom")}
                  className="ml-2"
                />
              </label>
            </div>
          </div>
          
          {/* Email or phone*/}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Mobile number or email address"
              value={identifier}
              onChange={(e) => setidentifier(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          
          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          
          {/* Terms and Policy */}
          <div className="text-xs text-gray-600 mb-3">
            <p>
              People who use our service may have uploaded your contact information to Facebook. 
              <a href="#" className="text-blue-600 ml-1">Learn more.</a>
            </p>
            
            <p className="mt-2">
              By clicking Sign Up, you agree to our 
              <a href="#" className="text-blue-600 ml-1">Terms</a>, 
              <a href="#" className="text-blue-600 ml-1">Privacy Policy</a> and 
              <a href="#" className="text-blue-600 ml-1">Cookies Policy</a>. 
              You may receive SMS Notifications from us and can opt out any time.
            </p>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-center mb-3">
            <button
              type="submit"
              className="bg-[#00a400] hover:bg-[#008800] text-white font-bold py-2 px-12 rounded text-xl"
            >
              Sign Up
            </button>
          </div>
          
          {/* Already Have Account */}
          <div className="text-center">
            <a href="#" className="text-blue-600 text-sm">
              Already have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;