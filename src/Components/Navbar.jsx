import React, { useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search handler
  const debouncedSearch = useCallback(debounce(onSearch, 300), [onSearch]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="flex h-20 w-[100%] rounded-md justify-between bg-white p-5 shadow">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Dashboard</h1>
      <div className="flex items-center gap-5 cursor-pointer">
        <div className="border flex items-center px-2 py-1 rounded">
          <CiSearch className="text-xl" />
          <input
            className="outline-none flex-1 px-2"
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={clearSearch}
            >
              ✕
            </button>
          )}
        </div>
        <div>
          <img
            width={60}
            src="https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg"
            alt="admin"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
