import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListsContainer from './components/Lists/ListsContainer';
import GoogleLoginButton from './components/Auth/GoogleLoginButton';
import AuthPage from './components/Auth/AuthPage'; // Make sure this path is correct

function App() {
  return (
    <Router>
      <main className="p-4">
        <Routes>
          {/* <Route path="/" element={<GoogleLoginButton />} /> */}
          <Route path="/" element={<AuthPage />} /> {/* New route for Login and Signup */}
          <Route path="/dashboard" element={<ListsContainer />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
