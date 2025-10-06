import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Sidebar from "./components/Sidebar";
import { useAuth } from "../context/AuthProvider";
import { Menu } from "lucide-react"; // Icon for the open button

const App = () => {
  const [authUser] = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Step 1: Create state to manage sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      {/* Conditionally render the "Open Sidebar" button */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-20 text-white hover:text-gray-300"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Conditionally render the Sidebar */}
      {authUser && isSidebarOpen && (
        <div className="w-64 h-full">
          <Sidebar toggleSidebar={toggleSidebar} />{" "}
          {/* Pass the function as a prop */}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <Signup />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
