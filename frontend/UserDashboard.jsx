import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { MapPin, Utensils, Navigation, Calendar, Filter, Heart, X, Search, Star, History, CheckCircle, Download, HelpCircle, MessageSquare, Send, ChevronDown, ChevronUp, Camera, Mountain, Plus, Check, Map, Share2, Cloud, Wind, Droplets, ChevronRight, ChevronLeft, Copy, ArrowRightLeft, PlusCircle, LayoutGrid } from 'lucide-react';
const MOCK_VEHICLES = [
  { 
    id: 1, 
    name: "BMW R 1250 GS", 
    type: "Bike", 
    price: 1500, 
    location: "Downtown", 
    img: "https://placehold.co/300x200?text=BMW+Bike",
    regNo: "UK07-BW-1234",
    seats: "2",
    engineType: "Boxer",
    engineCC: "1254 cc",
    power: "136 HP",
    mileage: "20 kmpl",
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "Adventure",
    lat: 30.3165,
    lng: 78.0322
  },
  { 
    id: 2, 
    name: "Mercedes C-Class", 
    type: "Car", 
    price: 5000, 
    location: "Airport", 
    img: "https://placehold.co/300x200?text=Mercedes",
    regNo: "UK07-MC-5678",
    seats: "5",
    engineType: "Inline-4",
    engineCC: "1999 cc",
    power: "255 HP",
    mileage: "16 kmpl",
    transmission: "Automatic",
    fuel: "Diesel",
    bodyType: "Sedan",
    lat: 30.1897,
    lng: 78.1803
  },
  { 
    id: 3, 
    name: "Vespa SXL 150", 
    type: "Scooter", 
    price: 600, 
    location: "Connaught Place", 
    img: "https://placehold.co/300x200?text=Vespa",
    regNo: "UK07-VS-9012",
    seats: "2",
    engineType: "Single Cylinder",
    engineCC: "150 cc",
    power: "10 HP",
    mileage: "45 kmpl",
    transmission: "CVT",
    fuel: "Petrol",
    bodyType: "Scooter",
    lat: 30.3256,
    lng: 78.0344
  },
];

const MOCK_FOOD_SPOTS = [
  { name: "Chetan Puri Wala", distance: "2km", rating: 4.9, specialty: "Famous Aloo Puri", cuisine: "North Indian" },
  { name: "Bun Tikki Stall (Dwarka)", distance: "3km", rating: 4.8, specialty: "Authentic Bun Tikki", cuisine: "Street Food" },
  { name: "Kalsang Friends Corner", distance: "5km", rating: 4.6, specialty: "Tibetan Cuisine", cuisine: "Tibetan" },
  { name: "Ellora's Melting Moments", distance: "4km", rating: 4.7, specialty: "Stick Jaw Toffees", cuisine: "Bakery" },
];

const MOCK_TOURIST_SPOTS = [
  // Dehradun & Nearby
  { name: "Robber's Cave (Guchhupani)", distance: "8km", rating: 4.7, type: "Nature" },
  { name: "Sahastradhara", distance: "14km", rating: 4.5, type: "Waterfall" },
  { name: "Forest Research Institute", distance: "5km", rating: 4.8, type: "Architecture" },
  { name: "Tapkeshwar Temple", distance: "6km", rating: 4.6, type: "Spiritual" },
  { name: "Mindrolling Monastery", distance: "9km", rating: 4.8, type: "Spiritual" },
  { name: "Malsi Deer Park", distance: "10km", rating: 4.4, type: "Nature" },
  { name: "Lachhiwala", distance: "22km", rating: 4.3, type: "Nature" },
  
  // Mussoorie & Rishikesh/Haridwar
  { name: "Kempty Falls", distance: "45km", rating: 4.3, type: "Waterfall" },
  { name: "Gun Hill", distance: "35km", rating: 4.4, type: "Nature" },
  { name: "Lal Tibba", distance: "38km", rating: 4.5, type: "Nature" },
  { name: "Triveni Ghat", distance: "45km", rating: 4.7, type: "Spiritual" },
  { name: "Ram Jhula", distance: "48km", rating: 4.6, type: "Architecture" },
  { name: "Har Ki Pauri", distance: "55km", rating: 4.8, type: "Spiritual" },
  { name: "Neer Garh Waterfall", distance: "50km", rating: 4.5, type: "Waterfall" },

  // Uttarakhand Major Spots
  { name: "Nainital Lake", distance: "280km", rating: 4.7, type: "Nature" },
  { name: "Jim Corbett National Park", distance: "170km", rating: 4.6, type: "Nature" },
  { name: "Auli Artificial Lake", distance: "300km", rating: 4.8, type: "Nature" },
  { name: "Valley of Flowers", distance: "320km", rating: 4.9, type: "Nature" },
  { name: "Kedarnath Temple", distance: "250km", rating: 4.9, type: "Spiritual" },
  { name: "Badrinath Temple", distance: "330km", rating: 4.8, type: "Spiritual" },

  // India Major Spots
  { name: "Taj Mahal, Agra", distance: "430km", rating: 4.9, type: "Architecture" },
  { name: "Red Fort, Delhi", distance: "250km", rating: 4.6, type: "Architecture" },
  { name: "Hawa Mahal, Jaipur", distance: "500km", rating: 4.5, type: "Architecture" },
  { name: "Golden Temple, Amritsar", distance: "400km", rating: 4.9, type: "Spiritual" },
  { name: "Pangong Lake, Ladakh", distance: "900km", rating: 4.8, type: "Nature" },
  { name: "Varanasi Ghats", distance: "850km", rating: 4.7, type: "Spiritual" },
  { name: "Gateway of India, Mumbai", distance: "1600km", rating: 4.6, type: "Architecture" },
  { name: "Kerala Backwaters", distance: "2500km", rating: 4.8, type: "Nature" },
  { name: "Goa Beaches", distance: "1900km", rating: 4.7, type: "Nature" },
];

const MOCK_BOOKINGS = [
  { id: 101, vehicle: "BMW R 1250 GS", date: "2024-04-20", status: "Upcoming", price: 1500, img: "https://placehold.co/300x200?text=BMW+Bike" },
  { id: 102, vehicle: "Vespa SXL 150", date: "2024-03-15", status: "Completed", price: 600, img: "https://placehold.co/300x200?text=Vespa" },
];

const INITIAL_TRANSACTIONS = [
  { id: 'TXN892103', date: '2024-04-20', amount: 1500, type: 'Payment', description: 'Booking: BMW R 1250 GS', status: 'Success' },
  { id: 'TXN772819', date: '2024-04-10', amount: 500, type: 'Refund', description: 'Security Deposit Refund', status: 'Success' },
  { id: 'TXN339102', date: '2024-03-15', amount: 600, type: 'Payment', description: 'Booking: Vespa SXL 150', status: 'Success' },
];

const MOCK_FAQS = [
  { question: "How do I book a vehicle?", answer: "Browse the available vehicles, select one you like, choose your dates, and click 'Book Now'." },
  { question: "What documents are required?", answer: "You need a valid Driving License and a Government ID proof to book a vehicle." },
  { question: "Is fuel included in the price?", answer: "No, fuel is not included. The vehicle is provided with a certain level of fuel and should be returned with the same level." },
  { question: "What is the cancellation policy?", answer: "You can cancel up to 24 hours before the booking start time for a full refund." },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [favorites, setFavorites] = useState([]);
  const [bookingModal, setBookingModal] = useState({ isOpen: false, vehicle: null });
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [reviewModal, setReviewModal] = useState({ isOpen: false, bookingId: null, vehicleName: '' });
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [transactionFilter, setTransactionFilter] = useState({ start: '', end: '', type: 'All' });
  const [transactionSort, setTransactionSort] = useState('dateDesc');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [spotRatings, setSpotRatings] = useState({});
  const [touristTypeFilter, setTouristTypeFilter] = useState('All');
  const [touristSort, setTouristSort] = useState('ratingDesc');
  const [foodCuisineFilter, setFoodCuisineFilter] = useState('All');
  const [foodSort, setFoodSort] = useState('ratingDesc');
  const [visibleTouristSpots, setVisibleTouristSpots] = useState(6);
  const [weather, setWeather] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [qrTimer, setQrTimer] = useState(90);
  const [isQrExpired, setIsQrExpired] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [transmissionFilter, setTransmissionFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [foodSpots, setFoodSpots] = useState(MOCK_FOOD_SPOTS);
  const [touristSpots, setTouristSpots] = useState(MOCK_TOURIST_SPOTS);
  const [userLocation, setUserLocation] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const bookingDays = bookingDates.start && bookingDates.end && new Date(bookingDates.end) >= new Date(bookingDates.start)
    ? Math.ceil((new Date(bookingDates.end).getTime() - new Date(bookingDates.start).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;
  const bookingTotalPrice = bookingModal.vehicle ? bookingDays * bookingModal.vehicle.price : 0;

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  useEffect(() => {
    let interval;
    if (bookingModal.isOpen && bookingStep === 2 && paymentMethod === 'UPI' && !isQrExpired) {
      interval = setInterval(() => {
        setQrTimer((prev) => {
          if (prev <= 1) {
            setIsQrExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [bookingModal.isOpen, bookingStep, paymentMethod, isQrExpired]);

  useEffect(() => {
    if (bookingModal.isOpen && bookingStep === 2 && paymentMethod === 'UPI') {
      setQrTimer(calculateQrTimer(bookingTotalPrice));
      setIsQrExpired(false);
    }
  }, [bookingStep, paymentMethod, bookingModal.isOpen, bookingTotalPrice]);

  const mockVerifyPayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success' });
      }, 5000);
    });
  };

  useEffect(() => {
    let isMounted = true;
    if (bookingModal.isOpen && bookingStep === 2 && paymentMethod === 'UPI' && !isQrExpired) {
      const verify = async () => {
        const result = await mockVerifyPayment();
        if (isMounted && result.status === 'success') {
          const days = bookingDays;
          const totalPrice = bookingTotalPrice;
          
          if (days <= 0) return;

          const newTransaction = {
            id: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toISOString().split('T')[0],
            amount: totalPrice,
            type: 'Payment',
            description: `Booking: ${bookingModal.vehicle.name}`,
            status: 'Success'
          };
          const newBooking = {
            id: Math.floor(Date.now() / 1000),
            vehicle: bookingModal.vehicle.name,
            date: bookingDates.start,
            status: 'Upcoming',
            price: totalPrice,
            img: bookingModal.vehicle.img
          };
          
          setBookings(prev => [newBooking, ...prev]);
          setTransactions(prev => [newTransaction, ...prev]);
          setActiveTab('bookings');
          closeBooking();
          alert("Payment Verified & Successful! Booking Confirmed.");
        }
      };
      verify();
    }
    return () => { isMounted = false; };
  }, [bookingModal.isOpen, bookingStep, paymentMethod, isQrExpired, bookingDays, bookingTotalPrice, bookingModal.vehicle, bookingDates.start]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('7300656060@sbi');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const geoData = await geoRes.json();
          if (geoData.city || geoData.locality) {
            setLocationQuery(geoData.city || geoData.locality);
          }
        } catch (e) {
          console.error("Reverse geocoding failed", e);
        }
      }, (error) => {
        console.error("Geolocation error:", error);
      });
    }
  };

  const toggleCompare = (vehicle) => {
    if (compareList.find(v => v.id === vehicle.id)) {
      setCompareList(compareList.filter(v => v.id !== vehicle.id));
    } else {
      if (compareList.length >= 2) {
        alert("You can only compare 2 vehicles at a time.");
        return;
      }
      setCompareList([...compareList, vehicle]);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateQrTimer = (price) => {
    if (price <= 0) return 90; // Default time if price is zero
    const baseTime = 60; // 60 seconds base
    const extraTimePer1000 = 15; // 15 seconds for every 1000
    const maxTime = 300; // 5 minutes max
    const calculatedTime = baseTime + Math.floor(price / 1000) * extraTimePer1000;
    return Math.min(maxTime, calculatedTime);
  };

  useEffect(() => {
    if (activeTab === 'smart' && !weather) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await response.json();
            
            const wmoCodes = {
              0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
              45: 'Fog', 48: 'Depositing rime fog',
              51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
              61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
              71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
              95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
            };

            let locationName = "Your Location";
            let region = "";
            try {
              const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              const geoData = await geoRes.json();
              if (geoData.city || geoData.locality) {
                locationName = `${geoData.city || geoData.locality}, ${geoData.principalSubdivision}`;
                region = geoData.principalSubdivision || "";
              }
            } catch (e) {
              console.log("Reverse geocoding failed", e);
            }

            setWeather({
              temp: Math.round(data.current_weather.temperature),
              condition: wmoCodes[data.current_weather.weathercode] || 'Unknown',
              humidity: 60 + Math.floor(Math.random() * 20),
              windSpeed: data.current_weather.windspeed,
              location: locationName
            });

            const calcDist = (lat1, lon1, lat2, lon2) => {
              const R = 6371; 
              const dLat = (lat2 - lat1) * Math.PI / 180;
              const dLon = (lon2 - lon1) * Math.PI / 180;
              const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              return (R * c).toFixed(1);
            };

            const getSpecialty = (cuisine, regionName) => {
              if (!cuisine) return "Local Delicacy";
              const c = cuisine.toLowerCase();
              const r = regionName.toLowerCase();

              if (c.includes('pizza')) return "Wood Fired Pizza";
              if (c.includes('burger')) return "Gourmet Burger";
              
              if (c.includes('indian')) {
                if (r.includes('punjab') || r.includes('delhi')) return "Butter Chicken & Naan";
                if (r.includes('maharashtra')) return "Misal Pav";
                if (r.includes('tamil') || r.includes('kerala') || r.includes('karnataka')) return "Masala Dosa";
                if (r.includes('bengal')) return "Fish Curry";
                if (r.includes('rajasthan')) return "Dal Baati Churma";
                if (r.includes('gujarat')) return "Gujarati Thali";
                if (r.includes('goa')) return "Seafood Curry";
                return "Traditional Thali";
              }

              if (c.includes('chinese')) return "Hakka Noodles";
              if (c.includes('japanese')) return "Sushi Platter";
              if (c.includes('mexican')) return "Tacos & Burritos";
              if (c.includes('italian')) return "Pasta Alfredo";
              if (c.includes('coffee') || c.includes('cafe')) return "Cappuccino & Croissant";
              if (c.includes('bakery')) return "Fresh Pastries";
              return c.charAt(0).toUpperCase() + c.slice(1) + " Special";
            };

            try {
              const foodRes = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node(around:5000,${latitude},${longitude})[amenity~"restaurant|cafe|fast_food"];out 10;`);
              const foodData = await foodRes.json();
              if (foodData.elements && foodData.elements.length > 0) {
                setFoodSpots(foodData.elements.map(el => {
                  const cuisineTag = el.tags.cuisine || (el.tags.amenity === 'cafe' ? 'Coffee' : 'Local');
                  return {
                    name: el.tags.name || "Local Eatery",
                    distance: `${calcDist(latitude, longitude, el.lat, el.lon)}km`,
                    rating: (3.5 + Math.random() * 1.4).toFixed(1),
                    specialty: getSpecialty(cuisineTag, region),
                    cuisine: cuisineTag.split(';')[0].charAt(0).toUpperCase() + cuisineTag.split(';')[0].slice(1)
                  };
                }).filter(el => el.name !== "Local Eatery"));
              }
            } catch (e) { console.error("Food fetch failed", e); }

            const getTouristCategory = (tags) => {
              if (tags.waterway === 'waterfall') return 'Waterfall';
              if (tags.natural || tags.tourism === 'viewpoint' || tags.tourism === 'zoo') return 'Nature';
              if (tags.historic || tags.tourism === 'museum' || tags.tourism === 'artwork') return 'Architecture';
              if (tags.amenity === 'place_of_worship') return 'Spiritual';
              return 'Sightseeing';
            };

            try {
              const tourRes = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];(node(around:10000,${latitude},${longitude})[tourism~"attraction|viewpoint|museum|zoo|theme_park"];node(around:10000,${latitude},${longitude})[historic];node(around:10000,${latitude},${longitude})[waterway=waterfall];node(around:10000,${latitude},${longitude})[natural~"peak|beach"];node(around:10000,${latitude},${longitude})[amenity=place_of_worship];);out 20;`);
              const tourData = await tourRes.json();
              if (tourData.elements && tourData.elements.length > 0) {
                setTouristSpots(tourData.elements.map(el => ({
                  name: el.tags.name || "Local Attraction",
                  distance: `${calcDist(latitude, longitude, el.lat, el.lon)}km`,
                  rating: (4.0 + Math.random()).toFixed(1),
                  type: getTouristCategory(el.tags)
                })).filter(el => el.name !== "Local Attraction"));
              }
            } catch (e) { console.error("Tourist fetch failed", e); }
          } catch (error) {
            console.error("Error fetching weather:", error);
            setWeather({ temp: 24, condition: "Partly Cloudy", humidity: 65, windSpeed: 12, location: "Dehradun, Uttarakhand" });
          }
        }, (error) => {
          console.error("Geolocation error:", error);
          setWeather({ temp: 24, condition: "Partly Cloudy", humidity: 65, windSpeed: 12, location: "Dehradun, Uttarakhand" });
        });
      } else {
        setWeather({ temp: 24, condition: "Partly Cloudy", humidity: 65, windSpeed: 12, location: "Dehradun, Uttarakhand" });
      }
    }
  }, [activeTab, weather]);

  const toggleItinerary = (spot) => {
    if (itinerary.find(item => item.name === spot.name)) {
      setItinerary(itinerary.filter(item => item.name !== spot.name));
    } else {
      setItinerary([...itinerary, spot]);
    }
  };

  const handleRateSpot = (spotName, rating) => {
    setSpotRatings(prev => ({ ...prev, [spotName]: rating }));
  };

  const handleShare = (spot) => {
    const text = `Check out this place in Dehradun: ${spot.name}. \nhttps://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + " Dehradun")}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const openBooking = (vehicle) => {
    setBookingModal({ isOpen: true, vehicle });
    setBookingStep(1);
    setPaymentMethod('');
  };

  const closeBooking = () => {
    setBookingModal({ isOpen: false, vehicle: null });
    setBookingDates({ start: '', end: '' });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    const days = bookingDays;
    const totalPrice = bookingTotalPrice;

    if (days <= 0) {
      alert("Please select a valid date range.");
      return;
    }
    const newTransaction = {
      id: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: totalPrice,
      type: 'Payment',
      description: `Booking: ${bookingModal.vehicle.name}`,
      status: 'Success'
    };
    const newBooking = {
      id: Math.floor(Date.now() / 1000),
      vehicle: bookingModal.vehicle.name,
      date: bookingDates.start,
      status: 'Upcoming',
      price: totalPrice,
      img: bookingModal.vehicle.img
    };
    setBookings(prev => [newBooking, ...prev]);
    setTransactions(prev => [newTransaction, ...prev]);
    setActiveTab('bookings');
    closeBooking();
  };

  const handleCancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const bookingToCancel = bookings.find(b => b.id === id);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
      
      if (bookingToCancel) {
        const refundTransaction = {
          id: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toISOString().split('T')[0],
          amount: bookingToCancel.price,
          type: 'Refund',
          description: `Refund: ${bookingToCancel.vehicle}`,
          status: 'Success'
        };
        setTransactions([refundTransaction, ...transactions]);
      }
    }
  };

  const openReview = (booking) => {
    setReviewModal({ isOpen: true, bookingId: booking.id, vehicleName: booking.vehicle });
    setReviewData({ rating: 0, comment: '' });
  };

  const closeReview = () => {
    setReviewModal({ isOpen: false, bookingId: null, vehicleName: '' });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert(`Review Submitted for ${reviewModal.vehicleName}\nRating: ${reviewData.rating} Stars\nComment: ${reviewData.comment}`);
    closeReview();
  };

  const handleDownloadInvoice = (booking) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text("RIDE FLEX", 20, 20);
    doc.setFontSize(12);
    doc.text("INVOICE", 20, 30);
    doc.line(20, 35, 190, 35); // Horizontal line
    
    // Details
    doc.text(`Invoice ID: INV-${booking.id}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 60);
    doc.text(`Vehicle: ${booking.vehicle}`, 20, 70);
    doc.text(`Booking Date: ${booking.date}`, 20, 80);
    doc.text(`Status: ${booking.status}`, 20, 90);
    
    doc.setFontSize(16);
    doc.text(`Total Amount: ₹${booking.price}`, 20, 110);
    
    doc.save(`Invoice_${booking.id}.pdf`);
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Date", "Description", "Type", "Amount", "Status"];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.description,
      t.type,
      t.amount,
      t.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVehicles = MOCK_VEHICLES.filter(v => {
    const min = priceRange.min ? Number(priceRange.min) : 0;
    const max = priceRange.max ? Number(priceRange.max) : Infinity;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = v.location.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesTransmission = transmissionFilter === 'All' || v.transmission === transmissionFilter;
    const matchesFuel = fuelFilter === 'All' || v.fuel === fuelFilter;
    return v.price >= min && v.price <= max && matchesSearch && matchesLocation && matchesTransmission && matchesFuel;
  }).sort((a, b) => {
    if (sortOrder === 'lowToHigh') return a.price - b.price;
    if (sortOrder === 'highToLow') return b.price - a.price;
    if (sortOrder === 'distanceAsc' && userLocation) {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto p-6 dark:text-white">
      <div className="flex gap-4 mb-8 border-b pb-4">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-full ${activeTab === 'browse' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
        >
          Browse Vehicles
        </button>
        <button 
          onClick={() => setActiveTab('smart')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'smart' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
        >
          <Navigation size={16} /> Smart Ride & Food
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
        >
          <Calendar size={16} /> My Bookings
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'favorites' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
        >
          <Heart size={16} /> Favorites
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'transactions' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
        >
          <History size={16} /> Transactions
        </button>
        <button 
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'support' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
        >
          <HelpCircle size={16} /> Help & Support
        </button>
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 border dark:border-slate-600 p-2 rounded w-full md:w-64 bg-gray-50 dark:bg-slate-700">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search vehicles..." 
                className="bg-transparent outline-none w-full text-sm dark:text-white"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 border dark:border-slate-600 p-2 rounded w-full md:w-64 bg-gray-50 dark:bg-slate-700">
              <MapPin size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search location..." 
                className="bg-transparent outline-none w-full text-sm dark:text-white"
                value={locationQuery}
                onChange={e => setLocationQuery(e.target.value)}
              />
              <button 
                onClick={detectLocation}
                className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition"
                title="Use Current Location"
              >
                <Navigation size={16} className="transform -rotate-45" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
              <Filter size={20} /> Filter by Price (₹)
            </div>
            <input 
              type="number" 
              placeholder="Min" 
              className="border dark:border-slate-600 p-2 rounded w-32 dark:bg-slate-700"
              value={priceRange.min}
              onChange={e => setPriceRange({...priceRange, min: e.target.value})}
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              className="border dark:border-slate-600 p-2 rounded w-32 dark:bg-slate-700"
              value={priceRange.max}
              onChange={e => setPriceRange({...priceRange, max: e.target.value})}
            />
            <select 
              className="border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 outline-none text-sm"
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
            >
              <option value="All">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="CVT">CVT</option>
            </select>
            <select 
              className="border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 outline-none text-sm"
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
            >
              <option value="All">All Fuels</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
            <select 
              className="border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 outline-none text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
              <option value="distanceAsc">Distance: Nearest First</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                <LayoutGrid size={20} />
              </button>
              <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition ${viewMode === 'map' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                <Map size={20} />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredVehicles.map(v => (
            <div key={v.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700 relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer" onClick={() => openBooking(v)}>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(v.id); }}
                className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 rounded-full shadow-md z-10 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <Heart size={20} className={favorites.includes(v.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleCompare(v); }}
                className={`absolute top-3 left-3 p-2 rounded-full shadow-md z-10 transition-colors ${compareList.find(c => c.id === v.id) ? 'bg-blue-600 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-gray-400 hover:bg-white dark:hover:bg-slate-800'}`}
                title="Compare"
              >
                <ArrowRightLeft size={20} />
              </button>
              <img src={v.img} alt={v.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded uppercase">{v.type}</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹{v.price}/day</span>
                </div>
                <h3 className="text-xl font-semibold mb-1 dark:text-white">{v.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                  <MapPin size={14}/> {v.location}
                  {userLocation && sortOrder === 'distanceAsc' && (
                    <span className="text-xs text-blue-600 ml-2">({calculateDistance(userLocation.lat, userLocation.lng, v.lat, v.lng).toFixed(1)} km)</span>
                  )}
                </p>
                <div className="w-full bg-slate-900 text-white py-2 rounded text-center font-semibold group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors">
                  Book Now
                </div>
              </div>
            </div>
          ))}
          </div>
          ) : (
            <div className="h-[600px] relative rounded-xl overflow-hidden shadow-lg border dark:border-slate-700">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${locationQuery || 'Dehradun'}+vehicle+rentals`}
              ></iframe>
              <div className="absolute top-4 left-4 bottom-4 w-80 overflow-y-auto space-y-4 pr-2 pb-2">
                {filteredVehicles.map(v => (
                  <div key={v.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border dark:border-slate-700 cursor-pointer hover:shadow-lg transition group" onClick={() => openBooking(v)}>
                    <img src={v.img} alt={v.name} className="w-full h-32 object-cover rounded-md mb-2" />
                    <h4 className="font-bold dark:text-white">{v.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">₹{v.price}/day</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><MapPin size={12}/> {v.location}</p>
                    <button className="mt-2 w-full bg-slate-900 text-white py-1.5 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Book Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'smart' && (
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Cloud size={28} /> Current Weather
                </h3>
                <p className="text-sky-100 mt-1 flex items-center gap-1">
                  <MapPin size={16} /> {weather ? weather.location : "Detecting location..."}
                </p>
              </div>
              
              {weather ? (
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <span className="text-5xl font-bold">{weather.temp}°</span>
                    <p className="text-sm text-sky-100 font-medium">{weather.condition}</p>
                  </div>
                  <div className="flex gap-6 text-sm border-l border-white/20 pl-6">
                    <div className="flex flex-col items-center gap-1"><Wind size={20} /> <span>{weather.windSpeed} km/h</span></div>
                    <div className="flex flex-col items-center gap-1"><Droplets size={20} /> <span>{weather.humidity}%</span></div>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex gap-4"><div className="h-16 w-16 bg-white/20 rounded-full"></div><div className="space-y-2"><div className="h-4 w-32 bg-white/20 rounded"></div><div className="h-4 w-24 bg-white/20 rounded"></div></div></div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Live Tracking Simulation */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-red-500" /> Live Ride Tracking
            </h3>
            <div className="bg-gray-200 h-64 rounded-lg overflow-hidden relative">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=Dehradun,Uttarakhand`}
              ></iframe>
            </div>
            <div className="mt-2 flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>Current Speed: 45 km/h</span>
              <span>Next Stop: 12km</span>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold">Route History</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>• Started at: Rajpur Road (10:00 AM)</li>
                <li>• Current: Mussoorie Road Diversion</li>
              </ul>
            </div>
          </div>

          {/* Authentic Food Suggestions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Utensils className="text-orange-500" /> Authentic Local Food
              </h3>
              <div className="flex gap-2">
                <select 
                  className="p-2 border rounded-lg text-sm outline-none bg-white dark:bg-slate-700 shadow-sm"
                  value={foodCuisineFilter}
                  onChange={(e) => setFoodCuisineFilter(e.target.value)}
                >
                  <option value="All">All Cuisines</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Street Food">Street Food</option>
                  <option value="Tibetan">Tibetan</option>
                  <option value="Bakery">Bakery</option>
                </select>
                <select 
                  className="p-2 border rounded-lg text-sm outline-none bg-white dark:bg-slate-700 shadow-sm"
                  value={foodSort}
                  onChange={(e) => setFoodSort(e.target.value)}
                >
                  <option value="ratingDesc">Rating: High to Low</option>
                  <option value="ratingAsc">Rating: Low to High</option>
                  <option value="distanceAsc">Distance: Nearest First</option>
                  <option value="distanceDesc">Distance: Furthest First</option>
                </select>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Taste the authentic flavors of Dehradun at these legendary spots.
            </p>
            <div className="space-y-4">
              {foodSpots.filter(spot => foodCuisineFilter === 'All' || spot.cuisine === foodCuisineFilter).sort((a, b) => {
                if (foodSort === 'ratingDesc') return b.rating - a.rating;
                if (foodSort === 'ratingAsc') return a.rating - b.rating;
                if (foodSort === 'distanceAsc') return parseFloat(a.distance) - parseFloat(b.distance);
                if (foodSort === 'distanceDesc') return parseFloat(b.distance) - parseFloat(a.distance);
                return 0;
              }).map((spot, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-slate-700 rounded-lg border border-orange-100 dark:border-slate-600">
                  <div>
                    <h4 className="font-bold text-slate-800">{spot.name}</h4>
                    <p className="text-xs text-orange-700 font-medium">{spot.specialty}</p>
                    <span className="text-xs text-gray-500">{spot.distance} away</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-bold text-sm">{spot.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + " Dehradun")}`, '_blank')}
                        className="text-xs bg-white text-orange-600 border border-orange-200 px-2 py-1 rounded hover:bg-orange-50 transition flex items-center gap-1"
                      >
                        <Navigation size={12} /> Directions
                      </button>
                      <button 
                        onClick={() => handleShare(spot)}
                        className="text-xs bg-white text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50 transition flex items-center gap-1"
                      >
                        <Share2 size={12} /> Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tourist Attractions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg md:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Camera className="text-blue-500" /> Must-Visit Tourist Spots
              </h3>
              <div className="flex gap-2">
                <select 
                  className="p-2 border rounded-lg text-sm outline-none bg-white dark:bg-slate-700 shadow-sm"
                  value={touristTypeFilter}
                onChange={(e) => {
                  setTouristTypeFilter(e.target.value);
                  setVisibleTouristSpots(6);
                }}
                >
                  <option value="All">All Types</option>
                  <option value="Nature">Nature</option>
                  <option value="Waterfall">Waterfall</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Spiritual">Spiritual</option>
                </select>
                <select 
                  className="p-2 border rounded-lg text-sm outline-none bg-white dark:bg-slate-700 shadow-sm"
                  value={touristSort}
                  onChange={(e) => setTouristSort(e.target.value)}
                >
                  <option value="ratingDesc">Rating: High to Low</option>
                  <option value="ratingAsc">Rating: Low to High</option>
                  <option value="distanceAsc">Distance: Nearest First</option>
                  <option value="distanceDesc">Distance: Furthest First</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {touristSpots.filter(spot => touristTypeFilter === 'All' || spot.type === touristTypeFilter).sort((a, b) => {
                if (touristSort === 'ratingDesc') return b.rating - a.rating;
                if (touristSort === 'ratingAsc') return a.rating - b.rating;
                if (touristSort === 'distanceAsc') return parseFloat(a.distance) - parseFloat(b.distance);
                if (touristSort === 'distanceDesc') return parseFloat(b.distance) - parseFloat(a.distance);
                return 0;
              }).slice(0, visibleTouristSpots).map((spot, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-slate-700 rounded-lg border border-blue-100 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <Mountain size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{spot.name}</h4>
                      <span className="text-xs text-gray-500">{spot.type} • {spot.distance} away</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="font-bold text-sm">{spot.rating}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + " Dehradun")}`, '_blank')}
                        className="text-xs bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition flex items-center gap-1"
                      >
                        <Navigation size={12} /> Directions
                      </button>
                      <button 
                        onClick={() => handleShare(spot)}
                        className="text-xs bg-white text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50 transition flex items-center gap-1"
                      >
                        <Share2 size={12} /> Share
                      </button>
                    </div>
                    <button 
                      onClick={() => toggleItinerary(spot)}
                      className={`text-xs border px-2 py-1 rounded transition flex items-center gap-1 ${
                        itinerary.find(i => i.name === spot.name) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                      }`}
                    >
                      {itinerary.find(i => i.name === spot.name) ? <Check size={12} /> : <Plus size={12} />} {itinerary.find(i => i.name === spot.name) ? 'Added' : 'Add to Itinerary'}
                    </button>
                    <div className="flex gap-0.5 mt-1" title="Rate this spot">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateSpot(spot.name, star)}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={14} 
                            className={`${(spotRatings[spot.name] || 0) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {visibleTouristSpots < touristSpots.filter(spot => touristTypeFilter === 'All' || spot.type === touristTypeFilter).length && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleTouristSpots(prev => prev + 6)}
                  className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition shadow-sm"
                >
                  Load More Spots
                </button>
              </div>
            )}
          </div>

          {/* Itinerary Section */}
          {itinerary.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg md:col-span-2">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Map className="text-green-600" /> Your Itinerary
              </h3>
              <div className="space-y-2">
                {itinerary.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-green-50 dark:bg-slate-700 rounded border border-green-100 dark:border-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-1.5 rounded-full text-green-600 shadow-sm">
                        <Mountain size={16} />
                      </div>
                      <span className="font-medium text-slate-800">{item.name}</span>
                    </div>
                    <button onClick={() => toggleItinerary(item)} className="text-red-500 hover:text-red-700 p-1">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded font-bold hover:bg-slate-800 transition">
                Save Itinerary
              </button>
            </div>
          )}
        </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
          <div className="grid gap-4">
            {bookings.map((booking, idx) => (
              <div key={booking.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow border dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center">
                <img src={booking.img} alt={booking.vehicle} className="w-full md:w-32 h-24 object-cover rounded-lg" />
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{booking.vehicle}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={14} /> {booking.date}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 mt-2 md:mt-0">
                  <span className="block text-xl font-bold text-slate-900 dark:text-white">₹{booking.price}</span>
                  <button 
                    onClick={() => openBookingDetails(booking)}
                    className="text-sm text-blue-600 hover:underline mt-1"
                  >
                    View Details
                  </button>
                  {booking.status === 'Upcoming' && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-sm text-red-600 hover:underline mt-1 block w-full text-right"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'Completed' && (
                    <button 
                      onClick={() => openReview(booking)}
                      className="text-sm text-yellow-600 hover:underline mt-1 block w-full text-right"
                    >
                      Rate & Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">My Favorites</h2>
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No favorite vehicles yet. Browse and heart items to save them here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_VEHICLES.filter(v => favorites.includes(v.id)).map(v => (
                <div key={v.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700 relative">
                  <button 
                    onClick={() => toggleFavorite(v.id)}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md z-10 hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                  >
                    <Heart size={20} className="fill-red-500 text-red-500" />
                  </button>
                  <img src={v.img} alt={v.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded uppercase">{v.type}</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">₹{v.price}/day</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1 dark:text-white">{v.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1"><MapPin size={14}/> {v.location}</p>
                    <button 
                      onClick={() => openBooking(v)}
                      className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Transaction History</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-700 p-2 rounded-lg border dark:border-slate-600 shadow-sm">
                <span className="text-sm text-gray-500">From:</span>
                <input 
                  type="date" 
                  className="text-sm outline-none dark:bg-slate-700 dark:text-white"
                  value={transactionFilter.start}
                  onChange={e => setTransactionFilter({...transactionFilter, start: e.target.value})}
                />
                <span className="text-sm text-gray-500">To:</span>
                <input 
                  type="date" 
                  className="text-sm outline-none dark:bg-slate-700 dark:text-white"
                  value={transactionFilter.end}
                  onChange={e => setTransactionFilter({...transactionFilter, end: e.target.value})}
                />
                <div className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1"></div>
                <select
                  className="text-sm outline-none bg-transparent dark:text-white"
                  value={transactionFilter.type}
                  onChange={e => setTransactionFilter({...transactionFilter, type: e.target.value})}
                >
                  <option value="All" className="dark:bg-slate-800">All Types</option>
                  <option value="Payment" className="dark:bg-slate-800">Payment</option>
                  <option value="Refund" className="dark:bg-slate-800">Refund</option>
                </select>
                {(transactionFilter.start || transactionFilter.end || transactionFilter.type !== 'All') && (
                  <button onClick={() => setTransactionFilter({ start: '', end: '', type: 'All' })} className="text-xs text-red-500 hover:underline ml-1">
                    <X size={14} />
                  </button>
                )}
              </div>
              <select
                className="border dark:border-slate-600 p-2 rounded-lg text-sm outline-none bg-white dark:bg-slate-700 shadow-sm"
                value={transactionSort}
                onChange={(e) => setTransactionSort(e.target.value)}
              >
                <option value="dateDesc">Date: Newest First</option>
                <option value="dateAsc">Date: Oldest First</option>
                <option value="amountDesc">Amount: High to Low</option>
                <option value="amountAsc">Amount: Low to High</option>
              </select>
              <button onClick={handleExportCSV} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.filter(txn => {
                  if (transactionFilter.start && txn.date < transactionFilter.start) return false;
                  if (transactionFilter.end && txn.date > transactionFilter.end) return false;
                  if (transactionFilter.type !== 'All' && txn.type !== transactionFilter.type) return false;
                  return true;
                }).sort((a, b) => {
                  if (transactionSort === 'dateDesc') return new Date(b.date) - new Date(a.date);
                  if (transactionSort === 'dateAsc') return new Date(a.date) - new Date(b.date);
                  if (transactionSort === 'amountDesc') return b.amount - a.amount;
                  if (transactionSort === 'amountAsc') return a.amount - b.amount;
                  return 0;
                }).map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="p-4 font-mono text-sm">{txn.id}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{txn.date}</td>
                    <td className="p-4 font-medium">{txn.description}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        txn.type === 'Refund' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${txn.type === 'Refund' ? 'text-green-600' : 'text-slate-800 dark:text-white'}`}>
                      {txn.type === 'Refund' ? '+' : '-'}₹{txn.amount}
                    </td>
                    <td className="p-4">
                      <span className="text-green-600 flex items-center gap-1 text-sm">
                        <CheckCircle size={14} /> {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.filter(txn => {
                  if (transactionFilter.start && txn.date < transactionFilter.start) return false;
                  if (transactionFilter.end && txn.date > transactionFilter.end) return false;
                  if (transactionFilter.type !== 'All' && txn.type !== transactionFilter.type) return false;
                  return true;
                }).length === 0 && (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">No transactions found in this date range.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FAQs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="text-slate-900" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {MOCK_FAQS.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-800 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    {faq.question}
                    {expandedFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedFaq === index && (
                    <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 text-sm border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-fit">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="text-blue-600" /> Contact Support
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Need help with a specific booking or have other queries? Send us a message.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Message Sent!\nSubject: ${contactForm.subject}\nMessage: ${contactForm.message}`);
              setContactForm({ subject: '', message: '' });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <select 
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  value={contactForm.subject}
                  onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Booking Issue">Booking Issue</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Vehicle Condition">Vehicle Condition</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea 
                  rows="4"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Describe your issue..."
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal.isOpen && bookingModal.vehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
            <button 
              onClick={closeBooking}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 z-20 bg-white/80 dark:bg-slate-900/80 rounded-full p-1"
            >
              <X size={24} />
            </button>
            
            {/* Vehicle Image & Details Side */}
            <div className="w-full md:w-1/2 relative bg-gray-100 dark:bg-slate-700">
                <img 
                    src={bookingModal.vehicle.img} 
                    alt={bookingModal.vehicle.name} 
                    className="w-full h-64 md:h-full object-cover" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                    <h3 className="text-3xl font-bold mb-2">{bookingModal.vehicle.name}</h3>
                    <div className="flex items-center gap-4 text-sm mb-4">
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold uppercase">{bookingModal.vehicle.type}</span>
                        <span className="flex items-center gap-1"><MapPin size={16}/> {bookingModal.vehicle.location}</span>
                    </div>
                    <p className="text-3xl font-bold">₹{bookingModal.vehicle.price}<span className="text-lg font-normal opacity-80">/day</span></p>
                </div>
            </div>

            {/* Booking Form Side */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white dark:bg-slate-900">
                {bookingStep === 1 ? (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6 dark:text-white">Vehicle Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Registration No", value: bookingModal.vehicle.regNo },
                        { label: "Body Type", value: bookingModal.vehicle.bodyType },
                        { label: "Seating Capacity", value: bookingModal.vehicle.seats },
                        { label: "Transmission", value: bookingModal.vehicle.transmission },
                        { label: "Fuel Type", value: bookingModal.vehicle.fuel },
                        { label: "Engine Type", value: bookingModal.vehicle.engineType },
                        { label: "Engine Capacity", value: bookingModal.vehicle.engineCC },
                        { label: "Horse Power", value: bookingModal.vehicle.power },
                        { label: "Mileage", value: bookingModal.vehicle.mileage },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">{item.label}</span>
                          <span className="font-medium text-slate-900 dark:text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t dark:border-slate-800 mt-auto">
                      <button 
                        onClick={() => setBookingStep(2)}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
                      >
                        Continue to Book <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => setBookingStep(1)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <ChevronLeft size={24} />
                  </button>
                  <h3 className="text-2xl font-bold dark:text-white">Complete Your Booking</h3>
                </div>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                            <input 
                            type="date" 
                            required 
                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none"
                            value={bookingDates.start}
                            min={today}
                            onChange={e => setBookingDates({...bookingDates, start: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                            <input 
                            type="date" 
                            required 
                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none"
                            value={bookingDates.end}
                            min={bookingDates.start || today}
                            onChange={e => setBookingDates({...bookingDates, end: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Price per day</span>
                            <span className="font-semibold dark:text-white">₹{bookingModal.vehicle.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Number of days</span>
                            <span className="font-semibold dark:text-white">{bookingDays > 0 ? bookingDays : '-'}</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-slate-700 !my-2"></div>
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span className="dark:text-white">Total Price</span>
                            <span className="text-green-500">₹{bookingTotalPrice > 0 ? bookingTotalPrice.toLocaleString('en-IN') : '0'}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Payment Method</label>
                        <div className="space-y-3">
                            {['UPI', 'Credit/Debit/ATM Card', 'Mobile Wallet', 'Net Banking'].map((method) => (
                                <label key={method} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-slate-900 bg-slate-50 dark:bg-slate-700 dark:border-slate-500 ring-1 ring-slate-900 dark:ring-slate-500' : 'hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                                        checked={paymentMethod === method}
                                        onChange={() => setPaymentMethod(method)}
                                    />
                                    <span className="ml-3 font-medium dark:text-white">{method}</span>
                                </label>
                            ))}
                        </div>
                        {paymentMethod === 'UPI' && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg flex flex-col items-center text-center border dark:border-slate-600">
                                {!isQrExpired ? (
                                  <>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scan QR to Pay</p>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=7300656060@sbi&pn=RideFlex&am=${bookingTotalPrice}&cu=INR`)}`}
                                        alt="UPI QR Code"
                                        className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total Payable: ₹{bookingTotalPrice}</p>
                                    <div className="flex items-center gap-2 mt-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded border dark:border-slate-600">
                                        <span className="text-sm font-mono text-slate-800 dark:text-slate-200">7300656060@sbi</span>
                                        <button 
                                            type="button"
                                            onClick={handleCopyUPI}
                                            className="text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition"
                                        >
                                            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold text-red-500 mt-2">Expires in: {formatTime(qrTimer)}</p>
                                    <p className="text-xs text-blue-500 mt-2 animate-pulse">Simulating payment verification...</p>
                                    <p className="text-xs text-blue-500 mt-2 animate-pulse">Verifying payment status via API...</p>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-40">
                                    <p className="text-red-500 font-bold mb-2">Payment Session Expired</p>
                                    <button 
                                        onClick={() => { setQrTimer(90); setIsQrExpired(false); }}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
                                    >
                                        Refresh QR Code
                                    </button>
                                  </div>
                                )}
                            </div>
                        )}
                        {paymentMethod === 'Credit/Debit/ATM Card' && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border dark:border-slate-600 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white outline-none focus:ring-2 focus:ring-slate-900" required />
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" maxLength="5" className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white outline-none focus:ring-2 focus:ring-slate-900" required />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">CVV</label>
                                        <input type="password" placeholder="123" maxLength="3" className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white outline-none focus:ring-2 focus:ring-slate-900" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Card Holder Name</label>
                                    <input type="text" placeholder="Name on Card" className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white outline-none focus:ring-2 focus:ring-slate-900" required />
                                </div>
                            </div>
                        )}
                        {paymentMethod === 'Mobile Wallet' && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border dark:border-slate-600 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Select Wallet</label>
                                    <select className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white outline-none focus:ring-2 focus:ring-slate-900" required>
                                        <option value="">Choose a wallet</option>
                                        <option value="Paytm">Paytm</option>
                                        <option value="PhonePe">PhonePe</option>
                                        <option value="Amazon Pay">Amazon Pay</option>
                                        <option value="Google Pay">Google Pay</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Linked Mobile Number</label>
                                    <input type="tel" placeholder="10-digit mobile number" pattern="[0-9]{10}" className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white outline-none focus:ring-2 focus:ring-slate-900" required />
                                </div>
                            </div>
                        )}
                        {paymentMethod === 'Net Banking' && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border dark:border-slate-600 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Select Bank</label>
                                    <select className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white outline-none focus:ring-2 focus:ring-slate-900" required>
                                        <option value="">Choose a bank</option>
                                        <option value="SBI">State Bank of India</option>
                                        <option value="HDFC">HDFC Bank</option>
                                        <option value="ICICI">ICICI Bank</option>
                                        <option value="Axis">Axis Bank</option>
                                        <option value="PNB">Punjab National Bank</option>
                                        <option value="Kotak">Kotak Mahindra Bank</option>
                                    </select>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded border border-blue-100 dark:border-blue-800">
                                    <p>You will be redirected to your bank's secure login page to complete the payment.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t dark:border-slate-800 mt-auto">
                        <button 
                            type="submit" 
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={20} /> Confirm Booking
                        </button>
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                            By clicking confirm, you agree to our terms and conditions.
                        </p>
                    </div>
                </form>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={closeReview}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Rate & Review</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">How was your ride with the <span className="font-bold text-slate-900 dark:text-white">{reviewModal.vehicleName}</span>?</p>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        className={star <= reviewData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Review</label>
                <textarea 
                  required 
                  rows="4"
                  className="w-full p-2 border rounded mt-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Share your experience..."
                  value={reviewData.comment}
                  onChange={e => setReviewData({...reviewData, comment: e.target.value})}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition mt-4"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={closeBookingDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-4 dark:text-white">Booking Details</h3>
            
            <div className="space-y-4">
              <img src={selectedBooking.img} alt={selectedBooking.vehicle} className="w-full h-48 object-cover rounded-lg" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Booking ID</p>
                  <p className="font-bold dark:text-white">#{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      selectedBooking.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                      selectedBooking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Vehicle</p>
                  <p className="font-bold dark:text-white">{selectedBooking.vehicle}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="font-bold text-green-600">₹{selectedBooking.price}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-bold dark:text-white">{selectedBooking.date}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownloadInvoice(selectedBooking)}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <Download size={20} /> Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Floating Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2 font-bold animate-bounce"
          >
            <ArrowRightLeft size={20} />
            Compare ({compareList.length})
          </button>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><ArrowRightLeft size={24} /> Compare Vehicles</h3>
                <button onClick={() => setIsCompareModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
            </div>
            <div className="p-6 overflow-y-auto">
                {compareList.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Select vehicles to compare.</p>
                ) : (
                    <div className={`grid ${compareList.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
                        {compareList.map(v => (
                            <div key={v.id} className="space-y-4 relative">
                                <button 
                                    onClick={() => toggleCompare(v)}
                                    className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200"
                                    title="Remove"
                                >
                                    <X size={16} />
                                </button>
                                <img src={v.img} alt={v.name} className="w-full h-48 object-cover rounded-lg shadow-sm" />
                                <div>
                                    <h4 className="text-xl font-bold dark:text-white">{v.name}</h4>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{v.price}<span className="text-sm font-normal text-gray-500">/day</span></p>
                                </div>
                                
                                <div className="space-y-3 text-sm">
                                    {[
                                        { label: "Type", value: v.type },
                                        { label: "Transmission", value: v.transmission },
                                        { label: "Fuel", value: v.fuel },
                                        { label: "Seats", value: v.seats },
                                        { label: "Mileage", value: v.mileage },
                                        { label: "Engine", value: `${v.engineCC} (${v.engineType})` },
                                        { label: "Power", value: v.power },
                                        { label: "Body Type", value: v.bodyType },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between border-b dark:border-slate-700 pb-2 last:border-0">
                                            <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                                            <span className="font-medium dark:text-white text-right">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => { setIsCompareModalOpen(false); openBooking(v); }}
                                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition"
                                >
                                    Book This Vehicle
                                </button>
                            </div>
                        ))}
                        {compareList.length === 1 && (
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-8 text-gray-400">
                                <PlusCircle size={48} className="mb-4 opacity-50" />
                                <p>Add another vehicle to compare</p>
                                <button 
                                    onClick={() => setIsCompareModalOpen(false)}
                                    className="mt-4 text-blue-600 hover:underline"
                                >
                                    Browse Vehicles
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserDashboard;