import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from "../utils/Constants";
import RouteDetails from './RouteDetails';
import MapView from './MapView';
import Notification from "../components/Notification";

const RouteForm = () => {
  const [origin, setOrigin] = useState({});
  const [distance, setDistance] = useState(0);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [route, setRoute] = useState({});
  const [polylines, setPolylines] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchSuggestions = async (input, setSuggestions) => {
    try {
      if (input.length > 3) {
        const response = await axios.get(`${url}/api/routes/place-suggestion`, {
          params: { input },
        });
        setSuggestions(response?.data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };
  
  const handleSelect = async (suggestion, setAddress, setSuggestions) => {
    setAddress(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRoute({});
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/api/routes/get-routes`, 
        { origin, distance }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setRoute(response.data.route);
      setPolylines(response.data.route.polylines);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Notification.showErrorMessage("Error", error?.response?.data?.message || "Server Error");
    }
  };

  const fetchLastRoute = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRoute({});
    setPolylines({});
    setOrigin({});
    setDistance(0);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/api/routes/get-last-routes`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setRoute(response.data.route);
      setPolylines(response.data.route.polylines);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Notification.showErrorMessage("Error", error?.response?.data?.message || "Server Error");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center justify-center h-screen w-full">
          <div className="border-t-8 border-8 border-gray-200 border-t-blue-500 rounded-full h-24 w-24 animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <h1 className="text-center text-2xl mb-4">Get Walking Routes</h1>
      <form onSubmit={handleSubmit} className="min-w-[350px] max-w-4xl bg-white shadow-md rounded mx-auto px-6 py-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Origin</label>
          <input
            type="text"
            value={origin.description || ''}
            onChange={(e) => {
              setOrigin({ description: e.target.value });
              fetchSuggestions(e.target.value, setOriginSuggestions);
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />          
          {originSuggestions?.length > 0 && (
            <div className="absolute z-10 bg-white w-1/4 border border-gray-300">
            {/* // <div class="absolute z-10 bg-white border border-gray-300 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/5"> */}
              {originSuggestions?.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSelect(suggestion, setOrigin, setOriginSuggestions)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Distance (KM)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex justify-between w-full mt-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Get Route
          </button>
          <button onClick={fetchLastRoute} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Last Route
          </button>
        </div>
      </form>
      {route?.route_data?.length > 0 && (
        <>
        <RouteDetails route={route} />
        <MapView polylines={polylines} />
        </>
      )}
    </div>
  );
};

export default RouteForm;