import { demouser } from "../Assets/index";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = ({ pagename }) => {
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((response) => {
      setUserInfo(response.data.data);
    });
  }, []);

  return (
    <nav style={{ backgroundColor: 'rgb(31, 41, 55)' }} className="bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <h1 className="text-lg font-semibold text-white">{pagename}</h1>
          <div className="flex items-center">
            <div className="flex items-center text-white">
              <img src={demouser} alt="avatar" className="h-8 w-8 rounded-full bg-gray-300" />
              <div className="ml-3">
                <span className="block font-medium text-sm">Visitor</span>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
