import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { vehicleAPI } from './api/vehicles';
import { bookingAPI } from './api/bookings';

import { PlusCircle, Package, Edit, X, Trash2, DollarSign, TrendingUp, ClipboardList, CheckCircle, XCircle, Download, Navigation } from 'lucide-react';
import { getCurrentLocationDetails } from './utils/location';

const MOCK_TRANSACTIONS = [
  { id: 101, vehicle: "Swift Dzire", date: "2024-04-10", amount: 2500, status: "Completed" },
  { id: 102, vehicle: "Royal Enfield Classic", date: "2024-04-12", amount: 1200, status: "Completed" },
  { id: 103, vehicle: "Activa 6G", date: "2024-04-15", amount: 400, status: "Pending" },
];

const MOCK_REQUESTS_DATA = [
  { id: 201, vehicle: "Swift Dzire", customer: "John Doe", dates: "2024-05-01 to 2024-05-05", amount: 5000, status: "Pending" },
  { id: 202, vehicle: "Royal Enfield Classic", customer: "Jane Smith", dates: "2024-05-10 to 2024-05-12", amount: 2400, status: "Pending" },
];

const MAX_DOCUMENT_SIZE_MB = 10;
const MAX_DOCUMENT_SIZE_BYTES = MAX_DOCUMENT_SIZE_MB * 1024 * 1024;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const DOCUMENT_FIELDS = ['rcDocument', 'insuranceDocument', 'pollutionDocument'];
const IMAGE_FIELDS = ['frontImage', 'backImage', 'rightImage', 'leftImage'];

const SellerDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    title: '',
    description: '',
    type: 'car',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: '4',
    engineSegment: '',
    city: '',
    pricePerHour: '',
    pricePerDay: '',
    deliveryAvailable: false,
    deliveryChargePerKm: '0',
    availableFrom: '',
    availableTo: '',
    weekendPrice: '',
    holidayPrice: '',
    minDuration: '1',
    frontImage: '',
    backImage: '',
    rightImage: '',
    leftImage: '',
    rcNumber: '',
    rcDocument: '',
    insuranceStartDate: '',
    insuranceExpiry: '',
    insuranceDocument: '',
    pollutionStartDate: '',
    pollutionExpiry: '',
    pollutionDocument: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [docPopupVehicle, setDocPopupVehicle] = useState(null);

  const initialVehicleState = {
    title: '',
    description: '',
    type: 'car',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: '4',
    engineSegment: '',
    city: '',
    pricePerHour: '',
    pricePerDay: '',
    deliveryAvailable: false,
    deliveryChargePerKm: '0',
    availableFrom: '',
    availableTo: '',
    weekendPrice: '',
    holidayPrice: '',
    minDuration: '1',
    frontImage: '',
    backImage: '',
    rightImage: '',
    leftImage: '',
    rcNumber: '',
    rcDocument: '',
    insuranceStartDate: '',
    insuranceExpiry: '',
    insuranceDocument: '',
    pollutionStartDate: '',
    pollutionExpiry: '',
    pollutionDocument: '',
  };

  const today = new Date().toISOString().split('T')[0];

  const isExpired = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const resetForm = () => {
    setNewVehicle(initialVehicleState);
    setEditingId(null);
  };

  const buildVehiclePayload = (vehicle) => ({
    title: vehicle.title,
    description: vehicle.description,
    type: vehicle.type,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    seatingCapacity: Number(vehicle.seatingCapacity),
    engineSegment: vehicle.engineSegment,
    city: vehicle.city,
    pricePerHour: Number(vehicle.pricePerHour),
    pricePerDay: Number(vehicle.pricePerDay),
    deliveryAvailable: Boolean(vehicle.deliveryAvailable),
    deliveryChargePerKm: Number(vehicle.deliveryChargePerKm),
    availableFrom: vehicle.availableFrom || undefined,
    availableTo: vehicle.availableTo || undefined,
    weekendPrice: vehicle.weekendPrice ? Number(vehicle.weekendPrice) : undefined,
    holidayPrice: vehicle.holidayPrice ? Number(vehicle.holidayPrice) : undefined,
    minDuration: vehicle.minDuration ? Number(vehicle.minDuration) : undefined,
    images: [vehicle.frontImage, vehicle.backImage, vehicle.rightImage, vehicle.leftImage].filter(Boolean),
    rcNumber: vehicle.rcNumber || undefined,
    rcDocument: vehicle.rcDocument || undefined,
    insuranceStartDate: vehicle.insuranceStartDate || undefined,
    insuranceExpiry: vehicle.insuranceExpiry || undefined,
    insuranceDocument: vehicle.insuranceDocument || undefined,
    pollutionStartDate: vehicle.pollutionStartDate || undefined,
    pollutionExpiry: vehicle.pollutionExpiry || undefined,
    pollutionDocument: vehicle.pollutionDocument || undefined,
  });

  const validateVehicleForm = () => {
    if (!/^[A-Z0-9]{10}$/.test(newVehicle.rcNumber)) {
      alert('RC Number must be exactly 10 uppercase letters/numbers.');
      return false;
    }

    if (newVehicle.availableFrom && newVehicle.availableFrom < today) {
      alert('Available From cannot be a back date.');
      return false;
    }

    if (newVehicle.availableTo && newVehicle.availableFrom && newVehicle.availableTo < newVehicle.availableFrom) {
      alert('Available To cannot be before Available From.');
      return false;
    }

    if (!newVehicle.insuranceStartDate || !newVehicle.insuranceExpiry || newVehicle.insuranceExpiry < newVehicle.insuranceStartDate) {
      alert('Please enter valid insurance start and end dates.');
      return false;
    }

    if (!newVehicle.pollutionStartDate || !newVehicle.pollutionExpiry || newVehicle.pollutionExpiry < newVehicle.pollutionStartDate) {
      alert('Please enter valid pollution start and end dates.');
      return false;
    }

    if (!newVehicle.frontImage || !newVehicle.backImage || !newVehicle.rightImage || !newVehicle.leftImage) {
      alert('Please upload front, back, right, and left vehicle images.');
      return false;
    }

    if (!newVehicle.rcDocument || !newVehicle.insuranceDocument || !newVehicle.pollutionDocument) {
      alert('Please upload RC, insurance, and pollution PDF documents.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateVehicleForm()) return;

    try {
      const payload = buildVehiclePayload(newVehicle);
      if (editingId) {
        const response = await vehicleAPI.updateVehicle(editingId, payload);
        const updatedVehicle = response.vehicle;
        setInventory(
          inventory.map((item) =>
            item.id === editingId || item._id === editingId
              ? { ...updatedVehicle, id: updatedVehicle._id }
              : item
          )
        );
      } else {
        const response = await vehicleAPI.createVehicle(payload);
        const createdVehicle = response.vehicle;
        setInventory([...inventory, { ...createdVehicle, id: createdVehicle._id }]);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        'Unable to save vehicle. Please check your inputs and try again.';
      alert(message);
    }
  };

  const handleEdit = (vehicle) => {
    setNewVehicle({
      title: vehicle.title || '',
      description: vehicle.description || '',
      type: vehicle.type || 'car',
      fuelType: vehicle.fuelType || 'Petrol',
      transmission: vehicle.transmission || 'Manual',
      seatingCapacity: vehicle.seatingCapacity?.toString() || '4',
      engineSegment: vehicle.engineSegment || '',
      city: vehicle.city || '',
      pricePerHour: vehicle.pricePerHour?.toString() || '',
      pricePerDay: vehicle.pricePerDay?.toString() || '',
      deliveryAvailable: vehicle.deliveryAvailable ?? false,
      deliveryChargePerKm: vehicle.deliveryChargePerKm?.toString() || '0',
      availableFrom: vehicle.availableFrom ? vehicle.availableFrom.split('T')[0] : '',
      availableTo: vehicle.availableTo ? vehicle.availableTo.split('T')[0] : '',
      weekendPrice: vehicle.weekendPrice?.toString() || '',
      holidayPrice: vehicle.holidayPrice?.toString() || '',
      minDuration: vehicle.minDuration?.toString() || '1',
      frontImage: vehicle.images?.[0] || '',
      backImage: vehicle.images?.[1] || '',
      rightImage: vehicle.images?.[2] || '',
      leftImage: vehicle.images?.[3] || '',
      rcNumber: vehicle.rcNumber || '',
      rcDocument: vehicle.rcDocument || '',
      insuranceStartDate: vehicle.insuranceStartDate ? vehicle.insuranceStartDate.split('T')[0] : '',
      insuranceExpiry: vehicle.insuranceExpiry ? vehicle.insuranceExpiry.split('T')[0] : '',
      insuranceDocument: vehicle.insuranceDocument || '',
      pollutionStartDate: vehicle.pollutionStartDate ? vehicle.pollutionStartDate.split('T')[0] : '',
      pollutionExpiry: vehicle.pollutionExpiry ? vehicle.pollutionExpiry.split('T')[0] : '',
      pollutionDocument: vehicle.pollutionDocument || '',
    });
    setEditingId(vehicle.id ?? vehicle._id);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      await vehicleAPI.deleteVehicle(id);
      setInventory(inventory.filter((item) => item.id !== id && item._id !== id));
      if (editingId === id) {
        handleCancel();
      }
    } catch (error) {
      console.error(error);
      alert('Unable to delete vehicle. Please try again.');
    }
  };

  const refreshRequests = async () => {
    const token = localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');
    if (!token) return;

    const resp = await bookingAPI.getSellerBookings();
    const bookings = resp?.bookings || [];

    const uiRequests = bookings.map((b) => ({
      id: b._id,
      vehicle: b.vehicle?.title || 'Vehicle',
      customer: b.user?.name || 'Customer',
      dates: `${new Date(b.startDate).toLocaleDateString()} to ${new Date(b.endDate).toLocaleDateString()}`,
      amount: b.totalAmount || 0,
      status:
        b.bookingStatus === 'confirmed'
          ? 'Approved'
          : b.bookingStatus === 'cancelled' || b.bookingStatus === 'rejected'
            ? 'Rejected'
            : 'Pending',
      _raw: b,
    }));

    setRequests(uiRequests);
  };

  const handleApprove = async (id) => {
    try {
      await bookingAPI.updateBookingStatus(id, 'confirmed');
      await refreshRequests();
    } catch (error) {
      console.error('Failed to approve booking', error);
      alert(error?.response?.data?.message || 'Failed to approve booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingAPI.updateBookingStatus(id, 'rejected');
      await refreshRequests();
    } catch (error) {
      console.error('Failed to reject booking', error);
      alert(error?.response?.data?.message || 'Failed to reject booking');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file && name) {
      if (DOCUMENT_FIELDS.includes(name)) {
        if (file.type !== 'application/pdf') {
          alert('Vehicle documents must be uploaded as PDF files.');
          e.target.value = '';
          return;
        }

        if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
          alert(`Vehicle documents must be under ${MAX_DOCUMENT_SIZE_MB}MB.`);
          e.target.value = '';
          return;
        }
      }

      if (IMAGE_FIELDS.includes(name)) {
        if (!file.type.startsWith('image/')) {
          alert('Vehicle photos must be image files.');
          e.target.value = '';
          return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          alert(`Vehicle photos must be under ${MAX_IMAGE_SIZE_MB}MB each.`);
          e.target.value = '';
          return;
        }
      }

      if (!DOCUMENT_FIELDS.includes(name) && !IMAGE_FIELDS.includes(name)) {
        alert('Unsupported upload field.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVehicle((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseVehicleLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocationDetails();
      setNewVehicle((prev) => ({ ...prev, city: location.city || prev.city }));
    } catch (error) {
      alert(error.message || 'Unable to fetch your location.');
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await vehicleAPI.getMyVehicles();
        const loadedVehicles = data.vehicles.map((vehicle) => ({ ...vehicle, id: vehicle._id }));
        setInventory(loadedVehicles);

        const alerts = loadedVehicles.flatMap((vehicle) =>
          (vehicle.documentAlerts || []).map((alert) => `${vehicle.title}: ${alert.message}`)
        );
        if (alerts.length > 0) {
          alert(alerts.join('\n'));
        }
      } catch (error) {
        console.error('Failed to load my vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch seller bookings/requests and show notifications.
  useEffect(() => {
    let cancelled = false;
    let lastSeenBookingIds = new Set();

    const loadRequests = async () => {
      try {
        setRequestsLoading(true);
        const token = localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');
        if (!token) return;

        const resp = await bookingAPI.getSellerBookings();
        const bookings = resp?.bookings || [];

        const uiRequests = bookings.map((b) => ({
          id: b._id,
          vehicle: b.vehicle?.title || 'Vehicle',
          customer: b.user?.name || 'Customer',
          dates: `${new Date(b.startDate).toLocaleDateString()} to ${new Date(b.endDate).toLocaleDateString()}`,
          amount: b.totalAmount || 0,
          status:
            b.bookingStatus === 'confirmed'
              ? 'Approved'
              : b.bookingStatus === 'cancelled' || b.bookingStatus === 'rejected'
                ? 'Rejected'
                : 'Pending',
          _raw: b,
        }));

        if (cancelled) return;

        // Update Requests table immediately (so tab shows the new row right away)
        setRequests(uiRequests);

        // Notify only for newly seen bookings.
        for (const r of uiRequests) {
          if (lastSeenBookingIds.has(r.id)) continue;
          lastSeenBookingIds.add(r.id);

          if (r.vehicle && r.customer) {
            alert(
              `New booking!\n\nVehicle: ${r.vehicle}\nCustomer: ${r.customer}\nStart & End Dates: ${r.dates}`
            );
          }
        }
      } catch (e) {
        console.error('Failed to load seller bookings', e);
      } finally {
        if (!cancelled) setRequestsLoading(false);
      }
    };

    loadRequests();
    const interval = setInterval(loadRequests, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const totalEarnings = MOCK_TRANSACTIONS
    .filter((t) => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    const headers = ['ID', 'Vehicle', 'Date', 'Amount', 'Status'];
    const rows = MOCK_TRANSACTIONS.map((t) => [t.id, t.vehicle, t.date, t.amount, t.status]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateVerification = async () => {
    try {
      const dealer = user?.dealer;
      const dealerId = dealer?._id || dealer?.id;
      if (!dealerId) {
        alert('Dealer id not found. Please login again.');
        return;
      }

      const token = localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');
      if (!token) {
        alert('Authentication token missing. Please login again.');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/dealers/${dealerId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Admin approval failed');
      }

      await updateUser({ isVerified: true });
      alert('Account Verified! (Simulated by calling admin approval API)');
      window.location.reload();
    } catch (e) {
      alert(e?.message || 'Admin approval simulation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto p-6 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">{user?.shopName || 'Dealer'} Dashboard</h1>

        {user?.role === 'seller' && user?.dealer?.approvalStatus === 'pending' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-yellow-800">Verification Pending</h3>
              <p className="text-yellow-700 text-sm">Your seller application is under review. Your vehicle listing will only become available for booking after admin approval.</p>
            </div>
            <button
              onClick={handleSimulateVerification}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-700 shadow-sm whitespace-nowrap"
            >
              Simulate Admin Approval
            </button>
          </div>
        )}

        <div className="flex gap-4 mb-8 border-b pb-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
          >
            <Package size={16} /> Inventory
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'requests' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
          >
            <ClipboardList size={16} /> Requests
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTab === 'earnings' ? 'bg-slate-900 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}
          >
            <DollarSign size={16} /> Earnings
          </button>
        </div>

        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
            <div className="p-4 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200">Incoming Booking Requests</div>
            {requests.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No pending requests.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm">
                  <tr>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Dates</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="p-4 font-medium">{req.vehicle}</td>
                      <td className="p-4">{req.customer}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{req.dates}</td>
                      <td className="p-4 font-bold">₹{req.amount}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            req.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : req.status === 'Rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        {req.status === 'Pending' && (
                          <>
                            <button onClick={() => handleApprove(req.id)} className="text-green-600 hover:text-green-800" title="Approve">
                              <CheckCircle size={20} />
                            </button>
                            <button onClick={() => handleReject(req.id)} className="text-red-600 hover:text-red-800" title="Reject">
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-fit">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                {editingId ? <Edit size={20} /> : <PlusCircle size={20} />} {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  placeholder="Vehicle Name (e.g. Swift Dzire)"
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  value={newVehicle.title}
                  onChange={(e) => setNewVehicle({ ...newVehicle, title: e.target.value })}
                  required
                />

                <textarea
                  placeholder="Short description of the vehicle"
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  rows={3}
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                  </select>

                  <select
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>

                  <select
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.transmission}
                    onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>

                  <input
                    placeholder="Seating Capacity"
                    type="number"
                    min="1"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.seatingCapacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, seatingCapacity: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Engine Segment (e.g. 125cc, 1.2L)"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.engineSegment}
                    onChange={(e) => setNewVehicle({ ...newVehicle, engineSegment: e.target.value })}
                    required
                  />

                  <div className="flex gap-2">
                    <input
                      placeholder="City"
                      className="min-w-0 flex-1 p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.city}
                      onChange={(e) => setNewVehicle({ ...newVehicle, city: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleUseVehicleLocation}
                      disabled={locationLoading}
                      className="px-3 border rounded text-slate-700 dark:text-slate-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-60"
                      title="Use current location"
                    >
                      <Navigation size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Price Per Hour"
                    type="number"
                    min="0"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.pricePerHour}
                    onChange={(e) => setNewVehicle({ ...newVehicle, pricePerHour: e.target.value })}
                    required
                  />

                  <input
                    placeholder="Price Per Day"
                    type="number"
                    min="0"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.pricePerDay}
                    onChange={(e) => setNewVehicle({ ...newVehicle, pricePerDay: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Weekend Price (Optional)"
                    type="number"
                    min="0"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.weekendPrice}
                    onChange={(e) => setNewVehicle({ ...newVehicle, weekendPrice: e.target.value })}
                  />

                  <input
                    placeholder="Holiday Price (Optional)"
                    type="number"
                    min="0"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.holidayPrice}
                    onChange={(e) => setNewVehicle({ ...newVehicle, holidayPrice: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Min Duration (Days)"
                    type="number"
                    min="1"
                    className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={newVehicle.minDuration}
                    onChange={(e) => setNewVehicle({ ...newVehicle, minDuration: e.target.value })}
                  />

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <input type="checkbox" checked={newVehicle.deliveryAvailable} onChange={(e) => setNewVehicle({ ...newVehicle, deliveryAvailable: e.target.checked })} />
                      Delivery Available
                    </label>
                    {newVehicle.deliveryAvailable && (
                      <input
                        placeholder="Delivery Charge / Km"
                        type="number"
                        min="0"
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        value={newVehicle.deliveryChargePerKm}
                        onChange={(e) => setNewVehicle({ ...newVehicle, deliveryChargePerKm: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available From</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.availableFrom}
                      min={today}
                      onChange={(e) => setNewVehicle({ ...newVehicle, availableFrom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available To</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.availableTo}
                      min={newVehicle.availableFrom || today}
                      onChange={(e) => setNewVehicle({ ...newVehicle, availableTo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RC Number</label>
                    <input
                      type="text"
                      maxLength="10"
                      pattern="[A-Z0-9]{10}"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.rcNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, rcNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) })}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">10 uppercase letters/numbers only.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RC Document</label>
                    <input
                      type="file"
                      name="rcDocument"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 dark:text-slate-400"
                      required={!editingId}
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF only, max 10MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Start</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.insuranceStartDate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceStartDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance End</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.insuranceExpiry}
                      min={newVehicle.insuranceStartDate || undefined}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExpiry: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Document</label>
                    <input
                      type="file"
                      name="insuranceDocument"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 dark:text-slate-400"
                      required={!editingId}
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF only, max 10MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pollution Start</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.pollutionStartDate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, pollutionStartDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pollution End</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      value={newVehicle.pollutionExpiry}
                      min={newVehicle.pollutionStartDate || undefined}
                      onChange={(e) => setNewVehicle({ ...newVehicle, pollutionExpiry: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pollution Document</label>
                    <input
                      type="file"
                      name="pollutionDocument"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 dark:text-slate-400"
                      required={!editingId}
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF only, max 10MB.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Images</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      ['frontImage', 'Front'],
                      ['backImage', 'Back'],
                      ['rightImage', 'Right'],
                      ['leftImage', 'Left'],
                    ].map(([name, label]) => (
                      <div key={name} className="border dark:border-slate-700 rounded p-2">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">{label}</label>
                        <input type="file" accept="image/*" name={name} onChange={handleFileChange} className="block w-full text-sm text-slate-500 dark:text-slate-400" required={!editingId && !newVehicle[name]} />
                        {newVehicle[name] && <img src={newVehicle[name]} alt={`${label} preview`} className="mt-2 h-24 w-full object-cover rounded" />}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload front, back, right, and left images. Max 5MB each.</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-500">
                    {editingId ? 'Update Vehicle' : 'Add to Inventory'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-3 rounded hover:bg-gray-400">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package size={20} /> Current Inventory
              </h3>

              {loading ? (
                <div className="bg-gray-100 dark:bg-slate-800 p-8 rounded-xl text-center text-gray-500 dark:text-gray-400">
                  Loading your vehicles...
                </div>
              ) : inventory.length === 0 ? (
                <div className="bg-gray-100 dark:bg-slate-800 p-8 rounded-xl text-center text-gray-500 dark:text-gray-400">
                  No vehicles listed yet. Add your first vehicle!
                </div>
              ) : (
                <div className="space-y-4">
                  {inventory.map((item) => (
                    <div key={item.id ?? item._id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border dark:border-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {item.images?.[0] && <img src={item.images[0]} alt={item.title || 'Vehicle image'} className="w-16 h-16 object-cover rounded" />}
                        <div>
                          <h4 className="font-bold text-lg">{item.title || item.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.type} • {item.fuelType} • {item.transmission} • {item.seatingCapacity} seats
                          </p>
                          {item.engineSegment && <p className="text-xs text-gray-500 dark:text-gray-400">Engine: {item.engineSegment}</p>}
                          {item.city && <p className="text-xs text-gray-500 dark:text-gray-400">City: {item.city}</p>}
                          <p className="text-xs text-gray-500 dark:text-gray-400">Listing: {item.availableFrom || 'N/A'} to {item.availableTo || 'N/A'}</p>
                          {item.documentAlerts?.map((alertItem) => (
                            <p key={`${item.id}-${alertItem.type}`} className="text-xs text-red-600 font-semibold">{alertItem.message}</p>
                          ))}
                          {!item.isActive && <p className="text-xs text-red-600 font-semibold">Inactive: customers cannot book this vehicle.</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="block text-xl font-bold text-green-600">₹{item.pricePerDay || item.price}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">per day</span>
                        </div>
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => setDocPopupVehicle(item)} className="text-cyan-600 hover:text-cyan-800 p-1" title="View documents">
                          <ClipboardList size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id ?? item._id)} className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-green-100 dark:border-green-900">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Earnings</p>
                    <h3 className="text-2xl font-bold text-slate-800">₹{totalEarnings}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Transactions</p>
                    <h3 className="text-2xl font-bold text-slate-800">{MOCK_TRANSACTIONS.length}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-700">
                <div className="font-bold text-slate-700 dark:text-slate-200">Transaction History</div>
                <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MOCK_TRANSACTIONS.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="p-4 font-medium">#{t.id}</td>
                      <td className="p-4">{t.vehicle}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{t.date}</td>
                      <td className="p-4 font-bold text-slate-800">₹{t.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}> 
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

