import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { background, knife, welcome } from "../Assets/index"; // Import welcome image
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (data.success) {
      // Check if user is admin
      if (data.data.user.role === "admin") {
        // Clear user token from local storage if exists
        localStorage.removeItem("userToken");
        // Save user token to local storage
        localStorage.setItem("userToken", data.token);
        navigate("/Dashboard");
      } else {
        // If user is not admin, show error message
        setErrorMessage("Only admins are allowed to access the platform.");
      }
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="knife-container">
        <div className="knife-image">
          <img src={knife} alt="Knife"></img>
        </div>
      </div>
      <div className="login-box">
        <div className="text-center">
          <h1 className="text-3xl font-bold mt-4 mb-2 ">Welcome to Our Website!</h1>
          <form onSubmit={loginUser} className="mx-auto mt-4 text-left">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mt-4 mb-2 text-gray-600 text-left">Login</h2>
            </div>
            <div className="text-left">
              <label className="block mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
            </div>
            <div className="text-left">
              <label className="block mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-sm"
              >
                Login
              </button>
            </div>
            {/* Display error message with CSS styles */}
            {errorMessage && (
              <p className="text-center text-red-500 mt-4 bg-red-100 rounded-lg p-2">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

