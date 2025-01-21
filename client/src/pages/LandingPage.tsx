import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-green-600">Sir Saws A Lot</h1>
      <p className="mt-4 text-lg text-gray-700">
        Welcome to Sir Saws A Lot! We provide expert tree trimming services
        in Minnesota. Let us help you keep your property safe and beautiful.
      </p>
      <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
        Learn More
      </button>
    </div>
  );
};

export default LandingPage;
