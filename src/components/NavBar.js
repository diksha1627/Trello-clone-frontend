import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // You can add a request to verify the token or check login status here
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const logout = () => {
    window.open('https://trello-clone-backend-cgik.onrender.com/api/auth/logout', '_self');
  };

  return (
    <div className="bg-blue-600 text-white shadow-md p-2">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">MyApp</h1>
        {isLoggedIn && (
          <button
            onClick={logout}
            className="bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
