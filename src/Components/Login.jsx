import React, { useState } from "react";
import { MdOutlineMarkAsUnread } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Dummy login logic
    const dummyEmail = "muhammadrohailazhar@gmail.com";
    const dummyPassword = "@muhammadrohailazhar2025";

    setTimeout(() => {
      if (email === dummyEmail && password === dummyPassword) {
        localStorage.setItem("token", "dummy-token-123");
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/hirer");
      } else {
        toast.error("Invalid email or password", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-purple-700 text-center">
          Login
        </h1>
        <p className="text-center text-gray-500">
          Please login to your account
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex items-center border border-purple-400 rounded-lg px-4 py-2 shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-purple-300 transition">
            <MdOutlineMarkAsUnread size={24} className="text-purple-400 mr-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none border-none text-gray-700 placeholder-gray-400 bg-transparent"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border border-purple-400 rounded-lg px-4 py-2 shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-purple-300 transition">
            <input
              type={isOpen ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full outline-none border-none text-gray-700 placeholder-gray-400 bg-transparent"
              required
            />
            {isOpen ? (
              <FaRegEyeSlash
                className="text-purple-400 ml-3 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            ) : (
              <FaRegEye
                className="text-purple-400 ml-3 cursor-pointer"
                onClick={() => setIsOpen(true)}
              />
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg shadow-md transition w-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
