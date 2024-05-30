import React, { useState, useEffect } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import axios from 'axios';
import footerwave from "../assets/images/health-footer.png";
import { url } from "../utils/Constants";
import Notification from "./Notification";
import Loading from "./Loading";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${url}/api/users/signin`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      setIsLoading(false);
      Notification.showSuccessMessage("Welcome", "Logged in Successfully");
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      Notification.showErrorMessage("Login Failed !", error?.response?.data?.message || "Server Error");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loading /></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
      <div className="min-w-[350px] max-w-md bg-opacity-50 bg-blur rounded-lg shadow-md relative p-6 m-4 z-10" style={{ border: "1px solid #567763", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>        
      <h2 className="text-center text-2xl mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-4">
          New user? <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <img src={footerwave} alt="Wave" className="w-full h-52" />
      </div>
    </div>
  );
};

export default LoginForm;

