import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dates, setDates] = useState({ start: '', end: '' });
  const [totalPrice, setTotalPrice] = useState(0);

  // Mock data matching the Home page
  const vehicles = [
    { id: 1, name: "Tesla Model 3", type: "Car", price: 45, rating: 4.9, image: "🚗", location: "Downtown", fuel: "Electric", seats: 5, transmission: "Automatic" },
    { id: 2, name: "Honda PCX 160", type: "Scooter", price: 15, rating: 4.7, image: "🛵", location: "Uptown", fuel: "Petrol", seats: 2, transmission: "Automatic" },
    { id: 3, name: "Royal Enfield Classic", type: "Bike", price: 25, rating: 4.8, image: "🏍️", location: "Airport", fuel: "Petrol", seats: 2, transmission: "Manual" },
    { id: 4, name: "Ford Mustang", type: "Car", price: 65, rating: 4.9, image: "🏎️", location: "Downtown", fuel: "Petrol", seats: 4, transmission: "Automatic" },
    { id: 5, name: "Vespa Sprint", type: "Scooter", price: 12, rating: 4.5, image: "🛵", location: "Central Station", fuel: "Petrol", seats: 2, transmission: "Automatic" },
    { id: 6, name: "Yamaha R15", type: "Bike", price: 20, rating: 4.6, image: "🏍️", location: "Uptown", fuel: "Petrol", seats: 2, transmission: "Manual" },
  ];

  // Find the vehicle by the URL param, default to the first one if not found
  const vehicle = vehicles.find(v => v.id === parseInt(id)) || vehicles[0];

  // Calculate total price dynamically
  useEffect(() => {
    if (dates.start && dates.end) {
      const start = new Date(dates.start);
      const end = new Date(dates.end);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If the user selects the same day or a valid range, calculate price
      setTotalPrice(diffDays >= 0 ? (diffDays + 1) * vehicle.price : 0);
    } else {
      setTotalPrice(0);
    }
  }, [dates, vehicle.price]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (totalPrice > 0) {
      // In a real app, you would send an API request to your backend here
      alert(`Successfully booked ${vehicle.name} for $${totalPrice}!`);
      navigate('/dashboard'); // Redirect user to their dashboard
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft size={20} /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicle Info Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-64 bg-slate-100 flex items-center justify-center text-9xl">
              {vehicle.image}
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-800">{vehicle.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1 mt-2">
                    <MapPin size={18} /> {vehicle.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <Star size={20} fill="currentColor" /> {vehicle.rating}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <span className="block text-gray-500 text-sm mb-1">Fuel Type</span>
                  <span className="font-bold text-gray-800">{vehicle.fuel}</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <span className="block text-gray-500 text-sm mb-1">Seats</span>
                  <span className="font-bold text-gray-800">{vehicle.seats}</span>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <span className="block text-gray-500 text-sm mb-1">Transmission</span>
                  <span className="font-bold text-gray-800">{vehicle.transmission}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Sidebar */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 h-fit sticky top-6">
          <div className="mb-6 pb-6 border-b border-gray-100">
            <span className="text-4xl font-extrabold text-gray-800">${vehicle.price}</span>
            <span className="text-gray-500 font-medium"> / day</span>
          </div>

          <form onSubmit={handleBooking} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pick-up Date</label>
              <input type="date" required onChange={(e) => setDates({ ...dates, start: e.target.value })} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Drop-off Date</label>
              <input type="date" required onChange={(e) => setDates({ ...dates, end: e.target.value })} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>

            {totalPrice > 0 && (
              <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center text-blue-900 font-bold">
                <span>Total Price</span>
                <span className="text-xl">${totalPrice}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4">
              <ShieldCheck size={20} /> Confirm Booking
            </button>
          </form>
          
          <ul className="mt-6 space-y-2 text-sm text-gray-500">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Free cancellation up to 24h</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Instant confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}