import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContextProvider } from "./context/UserContext";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoutePage from './pages/RoutePage';

const App = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<RoutePage />} />
          </Routes>
        </div>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;

