import React, { useState, useEffect } from "react";
import Menubar from "../Components/Menubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";
import Card from "../Components/Dashboard-card";
import { reedem, service, users, revenue } from "../Assets/index";
import axios from "axios"; 

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [rolePercentages, setRolePercentages] = useState({}); 

  useEffect(() => {
    const fetchRolePercentages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/stat");
        setRolePercentages(response.data.data); 
      } catch (error) {
        console.error("Error fetching role percentages:", error);
      }
    };

    fetchRolePercentages(); 
  }, []);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-grow">
        <div className={`w-1/5 h-full bg-gray-200 ${showMenu ? "" : "hidden"} lg:block`}>
          <Menubar />
        </div>
        <div className="flex-1 sm:relative">
          <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
          <div className="h-16 bg-white shadow-md">
            <Navbar pagename={"Dashboard"} />
          </div>
          <div className="flex flex-wrap justify-between mt-10 mx-4 sm:justify-start">
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-2 mb-4">
              <Card
                title={rolePercentages.admin ? `${rolePercentages.admin}%` : "Loading..."}
                subtitle={"Admins"}
                icon={users}
                color={"bg-gradient-to-r from-lime-400 to-lime-600"}
              />
            </div>
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-2 mb-4">
              <Card
                title={rolePercentages.professeur ? `${rolePercentages.professeur}%` : "Loading..."}
                subtitle={"Professeurs"}
                icon={users}
                color={"bg-gradient-to-r from-amber-400 to-amber-600"}
              />
            </div>
            <div className="w-full lg:w-1/4 px-2 mb-4">
              <Card
                title={rolePercentages.etudiant ? `${rolePercentages.etudiant}%` : "Loading..."}
                subtitle={"Etudiants"}
                icon={users}
                color={"bg-gradient-to-r from-purple-400 to-purple-600"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

