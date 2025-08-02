import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import HirerRequestScreen from "./Components/HirerRequestScreen";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/hirer"
          element={
            <div className="flex gap-2 min-h-screen bg-[#EDEEF3]">
              <Sidebar />
              <div className="flex-1 flex flex-col gap-4">
                <Navbar onSearch={handleSearch} />
                <HirerRequestScreen searchQuery={searchQuery} />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
