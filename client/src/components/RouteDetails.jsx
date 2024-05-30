import React from 'react';

const RouteDetails = ({ route }) => {
  const { origin_address, route_data, distance, updatedAt } = route;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white mx-2 rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Route Details</h2>
          <div className="mb-4">
            <div className="text-gray-600 font-semibold">Origin Address:</div>
            <div>{origin_address}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 font-semibold">Distance (KM):</div>
            <div>{distance}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 font-semibold">Date:</div>
            <div>{new Date(updatedAt).toLocaleString()}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-600 font-semibold">Route Steps:</div>
            <div className="space-y-4 mt-2">
              {route_data.map((step, index) => (
                <div key={index}>
                  <div className="bg-blue-200 py-2 px-4 rounded-lg shadow-md">
                    <div dangerouslySetInnerHTML={{ __html: step }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;
