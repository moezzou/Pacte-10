import React, { useState } from "react";
import { logo, dashboard, home, user, showcase, settings, role, market, content, customer, logout, revenue } from "../Assets/index";

const Menubar = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const menuItems = [
    { name: "Dashboard", icon: dashboard, link: "/dashboard" },
    { name: "Vente des jetons", icon: revenue, link: "/role-management" },
    { name: "Réclamations", icon: user, link: "/Reclamations" },];
   {/* { name: "Customer Management", icon: customer, link: "/customer-management" },
    { name: "Content Management", icon: content, link: "/content-management" },
    { name: "Showcase Management", icon: showcase, link: "/showcase-management" },
    { name: "Home Service Management", icon: home, link: "/home-service" },
    { name: "Market Place Management", icon: market, link: "/market-place" },
  { name: "Settings", icon: settings, link: "/settings" },*/}
  

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-center h-20">
        <img src={logo} alt="Company Logo" className="h-20 w-30 pt-5" />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="pt-6">
          <span className="block px-5 py-2 text-gray-800 font-semibold">Menu</span>
          <nav className="mt-4">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`flex items-center px-4 py-3 text-gray-600 hover:text-gray-800 ${selectedItem === item ? "text-lime-600 font-semibold" : ""}`}
                onClick={() => handleItemClick(item)}
                style={{ backgroundColor: selectedItem === item ? "#ebf8ff" : "" }}
                onMouseEnter={() => setSelectedItem(item)}
                onMouseLeave={() => setSelectedItem(null)}>
                <img src={item.icon} alt={item.name} className={`h-5 w-5 mr-2 ${index < 3 ? 'border border-gray-300 rounded-md' : ''}`} />
                <span className="hidden sm:inline-block">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center justify-center h-20 cursor-pointer text-red-500" onClick={() => { window.location.href = "/"; }}>
          <img src={logout} alt="Logout" className="h-6 w-6 mr-2" />
          <span className="hidden sm:inline-block text-lg font-semibold">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
