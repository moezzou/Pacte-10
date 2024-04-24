// RoleManagement.js

import React, { useState, useEffect } from "react";
import Menubar from "../Components/Menubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";
import UsersTable from "../Components/Table";
import { CSVLink } from "react-csv";

const RoleManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="flex">
      <div
        className={`w-1/4 h-auto h-screen bg-gray-200 ${
          showMenu ? "" : "hidden"
        } lg:block`}
      >
        <Menubar />
      </div>
      <div className="w-3/4 h-screen">
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <Navbar pagename={"Permission and Role Management"} />
        <div className="container mx-auto p-8">
          <div className="mb-4">
            {/* Search input */}
          </div>
          <div className="flex justify-end mb-4">
            {/* Download button */}
            <CSVLink data={csvData} filename={"users_report.csv"}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                Download Report
              </button>
            </CSVLink>
          </div>
          <UsersTable setCsvData={setCsvData} />
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
