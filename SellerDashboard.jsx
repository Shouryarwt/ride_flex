import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { PlusCircle, Package, Edit, X, Trash2, DollarSign, TrendingUp, ClipboardList, CheckCircle, XCircle, Download } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 101, vehicle: "Swift Dzire", date: "2024-04-10", amount: 2500, status: "Completed" },
  { id: 102, vehicle: "Royal Enfield Classic", date: "2024-04-12", amount: 1200, status: "Completed" },
  { id: 103, vehicle: "Activa 6G", date: "2024-04-15", amount: 400, status: "Pending" },
];

const MOCK_REQUESTS_DATA = [
  { id: 201, vehicle: "Swift Dzire", customer: "John Doe", dates: "2024-05-01 to 2024-05-05", amount: 5000, status: "Pending" },
  { id: 202, vehicle: "Royal Enfield Classic", customer: "Jane Smith", dates: "2024-05-10 to 2024-05-12", amount: 2400, status: "Pending" },
];

const SellerDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState(MOCK_REQUESTS_DATA);
  const [newVehicle, setNewVehicle] = useState({
    name: '', type: 'Car', price: '', fuel: 'Petrol', transmission: 'Manual', image: '', availableFrom: '', availableTo: '', weekendPrice: '', holidayPrice: '', minDuration: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setInventory(inventory.map(item => (item.id === editingId ? { ...newVehicle, id: editingId } : item)));
      setEditingId(null);
    } else {
      setInventory([...inventory, { ...newVehicle, id: Date.now() }]);
    }
    setNewVehicle({ name: '', type: 'Car', price: '', fuel: 'Petrol', transmission: 'Manual', image: '', availableFrom: '', availableTo: '', weekendPrice: '', holidayPrice: '', minDuration: '' });
  };

  const handleEdit = (vehicle) => {
    setNewVehicle(vehicle);
    setEditingId(vehicle.id);
  };

  const handleCancel = () => {
    setNewVehicle({ name: '', type: 'Car', price: '', fuel: 'Petrol', transmission: 'Manual', image: '', availableFrom: '', availableTo: '', weekendPrice: '', holidayPrice: '', minDuration: '' });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setInventory(inventory.filter(item => item.id !== id));
      if (editingId === id) {
        handleCancel();
      }
    }
  };

  const handleApprove = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
  };

  const handleReject = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVehicle(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const totalEarnings = MOCK_TRANSACTIONS
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    const headers = ["ID", "Vehicle", "Date", "Amount", "Status"];
    const rows = MOCK_TRANSACTIONS.map(t => [
      t.id,
      t.vehicle,
      t.date,
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

  const handleSimulateVerification = () => {
    updateUser({ isVerified: 'verified' });
    alert("Account Verified! (Simulation of Admin Approval)");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto p-6 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">{user?.shopName || 'Dealer'} Dashboard</h1>
      
      {user?.isVerified === 'pending' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-yellow-800">Verification Pending</h3>
            <p className="text-yellow-700 text-sm">Your documents (GST, ID Proof) are currently under review. You can manage your inventory, but your shop is not yet visible to customers.</p>
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
      
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Vehicle Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-fit">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            {editingId ? <Edit size={20} /> : <PlusCircle size={20} />} {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input 
              placeholder="Vehicle Name (e.g. Swift Dzire)" 
              className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              value={newVehicle.name}
              onChange={e => setNewVehicle({...newVehicle, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <select className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}>
                <option>Car</option><option>Bike</option><option>Scooter</option>
              </select>
              <input 
                placeholder="Base Price/Day" 
                type="number"
                className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={newVehicle.price}
                onChange={e => setNewVehicle({...newVehicle, price: e.target.value})}
                required
              />
              <input 
                placeholder="Weekend Price (Optional)" 
                type="number"
                className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={newVehicle.weekendPrice}
                onChange={e => setNewVehicle({...newVehicle, weekendPrice: e.target.value})}
              />
              <input 
                placeholder="Holiday Price (Optional)" 
                type="number"
                className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={newVehicle.holidayPrice}
                onChange={e => setNewVehicle({...newVehicle, holidayPrice: e.target.value})}
              />
              <input 
                placeholder="Min Duration (Days)" 
                type="number"
                className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={newVehicle.minDuration}
                onChange={e => setNewVehicle({...newVehicle, minDuration: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available From</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  value={newVehicle.availableFrom}
                  onChange={e => setNewVehicle({...newVehicle, availableFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available To</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  value={newVehicle.availableTo}
                  onChange={e => setNewVehicle({...newVehicle, availableTo: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
              />
              {newVehicle.image && (
                <img src={newVehicle.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded" />
              )}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-500">
                {editingId ? 'Update Vehicle' : 'Add to Inventory'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-3 rounded hover:bg-gray-400"><X size={20} /></button>
              )}
            </div>
          </form>
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package size={20} /> Current Inventory
          </h3>
          {inventory.length === 0 ? (
            <div className="bg-gray-100 dark:bg-slate-800 p-8 rounded-xl text-center text-gray-500 dark:text-gray-400">
              No vehicles listed yet. Add your first vehicle!
            </div>
          ) : (
            <div className="space-y-4">
              {inventory.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border dark:border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
                    <div>
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.type} • {item.fuel} • {item.transmission}</p>
                      {item.minDuration && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Min Duration: {item.minDuration} days</p>
                      )}
                      {(item.availableFrom || item.availableTo) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available: {item.availableFrom || 'N/A'} to {item.availableTo || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-xl font-bold text-green-600">₹{item.price}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">per day</span>
                      {item.weekendPrice && (
                        <span className="block text-xs text-blue-600 font-medium mt-1">₹{item.weekendPrice} (Weekend)</span>
                      )}
                      {item.holidayPrice && (
                        <span className="block text-xs text-purple-600 font-medium mt-1">₹{item.holidayPrice} (Holiday)</span>
                      )}
                    </div>
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-1">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1">
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
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="p-4 font-medium">{req.vehicle}</td>
                    <td className="p-4">{req.customer}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{req.dates}</td>
                    <td className="p-4 font-bold">₹{req.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
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

      {activeTab === 'earnings' && (
        <div className="space-y-8">
          {/* Stats Cards */}
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

          {/* Transaction List */}
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
                {MOCK_TRANSACTIONS.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="p-4 font-medium">#{t.id}</td>
                    <td className="p-4">{t.vehicle}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.date}</td>
                    <td className="p-4 font-bold text-slate-800">₹{t.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
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