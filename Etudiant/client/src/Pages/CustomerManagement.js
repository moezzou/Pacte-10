import React, { useState } from "react";
import Menubar from "../Components/Menubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const CustomerManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [complaint, setComplaint] = useState(""); // State to store user's complaint

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send the complaint data to the backend
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaint }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Complaint submitted successfully");
        // Optionally, display a success message to the user or perform any other action
      } else {
        console.error("Failed to submit complaint:", data.message);
        // Optionally, display an error message to the user or perform any other action
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      // Optionally, display an error message to the user or perform any other action
    }
    // Clear the complaint input after submission
    setComplaint("");
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
        <Navbar pagename={"Réclamations"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Entrez votre réclamation</h1>
          <form onSubmit={handleSubmit}>
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Saisissez votre réclamation ici"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              rows={6}
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-sm"
            >
              Soumettre
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;


