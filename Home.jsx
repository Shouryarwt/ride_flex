import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-6">
        Ride <span className="text-yellow-500">Flex</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
        Premium Luxury Vehicle Rentals. Two-wheelers and Four-wheelers at your fingertips.
      </p>
      <div className="flex gap-4">
        <Link to="/auth" className="bg-yellow-500 text-slate-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition">
          Book a Ride
        </Link>
        <Link to="/auth" className="border-2 border-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-slate-900 transition">
          Become a Partner
        </Link>
      </div>
    </div>
  );
};

export default Home;