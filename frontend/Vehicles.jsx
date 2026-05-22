import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

export default function Vehicles() {
  // State to keep track of the currently selected category filter
  const [filter, setFilter] = useState('All');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/vehicles`);
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const data = await response.json();
        
        // Safely extract the array
        const fetchedVehicles = data.vehicles || data.data || [];
        
        // If your MongoDB database is empty, fallback to mock data temporarily
        // so your UI doesn't look broken while you are developing!
        if (fetchedVehicles.length === 0) {
          setVehicles([
            { _id: 'm1', title: "Tesla Model 3", type: "Car", pricePerDay: 45, rating: 4.9, image: "🚗", city: "Downtown" },
            { _id: 'm2', title: "Honda PCX 160", type: "Scooter", pricePerDay: 15, rating: 4.7, image: "🛵", city: "Uptown" },
            { _id: 'm3', title: "Royal Enfield", type: "Bike", pricePerDay: 25, rating: 4.8, image: "🏍️", city: "Airport" },
            { _id: 'm4', title: "Ford Mustang", type: "Car", pricePerDay: 65, rating: 4.9, image: "🏎️", city: "Downtown" }
          ]);
        } else {
          setVehicles(fetchedVehicles);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  const categories = ['All', 'Car', 'Scooter', 'Bike'];

  // Filter the vehicles based on the selected category
  const filteredVehicles = vehicles.filter(vehicle =>
    filter === 'All' ? true : vehicle.type?.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Find Your Perfect Ride</h1>
        <p className="text-gray-500">Filter by category and choose the vehicle that fits your needs.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center gap-4 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              filter === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500 font-bold">Loading vehicles...</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500 font-bold">Error: {error}</div>
      )}

      {/* Vehicle Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle._id || vehicle.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="h-48 bg-slate-100 flex items-center justify-center text-7xl">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img src={vehicle.images[0]} alt={vehicle.title || vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    vehicle.image || '🚗'
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{vehicle.title || vehicle.name}</h2>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={14} fill="currentColor" /> {vehicle.rating || 'New'}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-4 flex-grow">
                    <MapPin size={16} /> {vehicle.city || vehicle.location}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-extrabold text-gray-800">${vehicle.pricePerDay || vehicle.price}</span>
                      <span className="text-gray-500 text-sm"> / day</span>
                    </div>
                    <Link
                      to={`/vehicle/${vehicle._id || vehicle.id}`}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No vehicles found for this category.
            </div>
          )}
        </>
      )}
    </div>
  );
}