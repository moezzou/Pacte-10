import React, { useState, useEffect } from "react";
import Menubar from "../Components/Menubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";
import "./Reclamations.css";
const Reclamations = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    // Fetch complaints from the backend when the component mounts
    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/complaints");
        const data = await response.json();
        if (data.success) {
          setComplaints(data.data);
        } else {
          console.error("Failed to fetch complaints:", data.message);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []); // Empty dependency array to run effect only once on component mount

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
        <Navbar pagename={"Réclamations"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Liste des réclamations</h1>
          <div className="complaints-container">
            {complaints.map((complaint) => (
              <div className="complaint-box" key={complaint._id}>
                <div className="complaint-content">
                  <p>{complaint.complaint}</p>
                  <p>Date: {new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reclamations;

