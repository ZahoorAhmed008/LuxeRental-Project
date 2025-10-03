import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 🚫 Block admin email from user login
      if (activeTab === "user" && formData.email === "luxerental12@gmail.com") {
        alert("❌ Please use another account.");
        return;
      }

      // 🔹 Common Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const loggedUser = userCredential.user;

      // 🔹 Admin check
      if (activeTab === "admin") {
        if (loggedUser.email === "luxerental12@gmail.com") {
          alert("✅ Admin login successful!");
          navigate("/admin");
          return;
        } else {
          alert("❌ You are not authorized as Admin!");
          return;
        }
      }

      // 🔹 Normal user
      alert("✅ User login successful!");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        alert("Login failed: " + error.message);
      } else {
        alert("Login failed: An unknown error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 via-white to-purple-100">
      {/* Left Side Branding */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white/60 backdrop-blur-lg p-10">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight">
            LuxeRental
          </h1>
          <p className="text-lg text-gray-700">Rent luxury. Wear royalty.</p>
          <motion.img
            src="/assets/Login Pic.png"
            alt="Seasonal fashion illustration"
            className="w-72 h-auto rounded-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md backdrop-blur-lg rounded-xl p-8 space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-600 mt-1">
              Sign in to your LuxeRental account
            </p>
          </div>

          {/* 🔹 Tab Switch */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "admin"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* User Actions */}
            {activeTab === "user" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {activeTab === "admin" ? "Sign in as Admin" : "Sign in"}
            </button>

            {/* Redirect */}
            {activeTab === "user" && (
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
