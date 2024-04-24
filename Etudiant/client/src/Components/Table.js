import axios from "axios";
import { useState, useEffect } from "react";

const UsersTable = ({ setCsvData }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tokensToAdd, setTokensToAdd] = useState("");
  const [tokensAdded, setTokensAdded] = useState(0); // State to store tokens added

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const fetchedUsers = response.data.data.map((user) => ({
          ...user,
          tokens: user.tokens || 0, // Default to 0 if tokens are not present
        }));
        setUsers(fetchedUsers);
        // Set CSV data
        setCsvData([
          ["Email Address", "Tokens", "Tokens Added", "Last Modified"], // Update CSV headers
          ...fetchedUsers.map((user) => [
            user.email,
            user.tokens,
            user.tokensAdded || 0,
            user.lastModified || "N/A", // Include lastModified in CSV data
          ]),
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [setCsvData]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateTokens = async () => {
    try {
      if (!tokensToAdd || isNaN(tokensToAdd)) {
        // Handle invalid input
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/users/${selectedUserId}/addTokens`,
        { tokensToAdd: parseInt(tokensToAdd) } // Convert input to integer
      );
      
      const updatedUsers = users.map((user) =>
        user._id === selectedUserId
          ? {
              ...user,
              tokens: user.tokens + parseInt(tokensToAdd),
              tokensAdded: parseInt(tokensToAdd), // Update tokensAdded for selected user
              lastModified: new Date().toISOString() // Update lastModified with current date and time
            }
          : user
      );
      setUsers(updatedUsers);
      setTokensToAdd(""); // Clear the input field after adding tokens
      setTokensAdded(parseInt(tokensToAdd)); // Update tokensAdded state
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border-2 border-gray-400 rounded-md py-2 px-4 w-full"
          onChange={handleSearch}
        />
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-4 py-2">S.No</th>
            <th className="px-4 py-2">Email Address</th>
            <th className="px-4 py-2">Tokens</th>
            <th className="px-4 py-2">Last Modified</th> {/* New column */}
            <th className="px-4 py-2">Tokens Added</th> {/* New column */}
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.tokens}</td>
              <td className="px-4 py-2">{user.lastModified || "N/A"}</td> {/* Display lastModified or "N/A" if not present */}
              <td className="px-4 py-2">{user.tokensAdded || 0}</td> {/* Display tokensAdded or 0 if not present */}
              <td className="px-4 py-2">
                {selectedUserId === user._id ? (
                  <div className="flex">
                    <input
                      type="number"
                      className="border-2 border-gray-400 rounded-md py-1 px-2 w-16"
                      value={tokensToAdd}
                      onChange={(e) => setTokensToAdd(e.target.value)}
                    />
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-md ml-2"
                      onClick={updateTokens}
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-md"
                    onClick={() => setSelectedUserId(user._id)}
                  >
                    Add Tokens
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
