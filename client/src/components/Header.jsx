import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate("/login");
  };

  return (
    <header className="bg-blue-500 p-4 flex justify-between items-center fixed top-0 left-0 w-full">
      <div className="text-white text-lg">
        {username ? `Welcome, ${username.charAt(0).toUpperCase()}${username.slice(1).toLowerCase()}` : 'Welcome'}
      </div>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-500 font-bold py-2 px-4 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
