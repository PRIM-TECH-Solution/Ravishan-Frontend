import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-12 rounded-lg shadow-lg text-center relative"> {/* Relative positioning */}
        <button 
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700" 
          onClick={onClose} 
          aria-label="Close" // Added aria-label for accessibility
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="text-3xl font-bold mb-6">You are not logged in !</p>
        <div className="flex justify-between">
          <Link to="/guestbooking">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2 text-xl"
            >
              Book as a Guest
            </motion.button>
          </Link>
          <Link to="/signIn">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-700 ml-2 text-xl"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
