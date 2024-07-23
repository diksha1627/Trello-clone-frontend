import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import GoogleLoginButton from './GoogleLoginButton';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Welcome</h1>
        {isLogin ? <Login onToggle={toggleForm} /> : <Signup onToggle={toggleForm} />}
        <div className="mt-6 text-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
