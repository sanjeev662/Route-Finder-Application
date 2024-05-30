import React from "react";
import footerwave from "../assets/images/health-footer.png";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="border-t-8 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin h-24 w-24 mb-4"></div>
      <div className="absolute bottom-0 left-0 right-0">
        <img src={footerwave} alt="Wave" className="w-full h-52" />
      </div>
    </div>
  );
};

export default Loading;

