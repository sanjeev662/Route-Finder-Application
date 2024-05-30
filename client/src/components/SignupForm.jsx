import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Notification from "../components/Notification";
import Loading from "../components/Loading";
import { url } from "../utils/Constants";
import footerwave from "../assets/images/health-footer.png";

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${url}/api/users/signup`, { name, email, password });
      navigate('/login');
      setIsLoading(false);
      Notification.showSuccessMessage("Success", "User Registered Successfully");
    } catch (error) {
      setIsLoading(false);
      Notification.showErrorMessage("Registration Failed", error?.response?.data?.message || "Server Error");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loading /></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="min-w-[350px] max-w-md bg-opacity-50 bg-blur rounded-lg shadow-md relative p-6 m-4 z-10"
        style={{ border: "1px solid #567763", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
        <h2 className="text-center text-2xl mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-3">
          Already have an account? <Link to="/login" className="text-blue-500">Sign in</Link>
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <img src={footerwave} alt="Wave" className="w-full h-52" />
      </div>
    </div>
  );
};

export default SignupForm;
