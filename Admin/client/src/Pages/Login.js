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
      <div className="knife-container ">
        <div className="knife-image">
          <img src={knife} alt="Knife"></img>
        </div>
      </div>
      <div class="flex flex-col w-full justify-center	 md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] shadow-xl">

    <form onSubmit={loginUser} class="flex flex-col">
        <div class="pb-2">
            <label for="email" value={email}
                onChange={(e) => setEmail(e.target.value)} type="email" class="block mb-2 text-base font-medium text-[#111827]">Email</label>
            <div class="relative text-gray-400"><span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                <input type="email" name="email" id="email" class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="name@supcom/isetcom.tn" autocomplete="off"></input>
            </div>
        </div>
        <div class="pb-6">
            <label for="password" class="block mb-2 text-base font-medium text-[#111827]">Password</label>
            <div class="relative text-gray-400"><span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-asterisk"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M12 8v8"></path><path d="m8.5 14 7-4"></path><path d="m8.5 10 7 4"></path></svg></span> 
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••••" class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autocomplete="new-password" aria-autocomplete="list"></input>
            </div>
        </div>
        <button type="submit" class="w-40 text-[#FFFFFF] bg-[#0000ff] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 self-center">Login</button>
        
        {errorMessage && (
              <p className="text-center text-red-500 mt-4 bg-red-100 rounded-lg p-2">
                {errorMessage}
              </p>
            )}


            <div class="flex items-center justify-between pb-6">
            <img src=""></img>
        <img src=""></img>
            </div>
        


    </form>
</div>
    </div>
  );
};

export default Login;

