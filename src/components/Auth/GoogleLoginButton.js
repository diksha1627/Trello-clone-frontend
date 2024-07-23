import React from 'react';
import { useNavigate } from 'react-router-dom';
import google from "../../google.png"
function GoogleLoginButton() {
  const navigate = useNavigate();

  const googleAuth = () => {
    window.open(`https://trello-clone-backend-cgik.onrender.com/api/auth/google/`, "_self");
  };

  return (
    <div className="text-center mt-4">
      {/* <h2 className="text-xl font-semibold text-blue-600 mb-2">Login with Google</h2> */}
      <button
        onClick={googleAuth}
        className="bg-blue-500 text-black py-2 px-4 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-600 
        focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <img
          src={google}
          alt="Google"
          className="w-6 h-6 rounded-xl"
        />
        <span className="text-white">Sign in with Google</span>
      </button>
    </div>
  );
}

export default GoogleLoginButton;
