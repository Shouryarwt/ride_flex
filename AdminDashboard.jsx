import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const token = localStorage.getItem('rideFlexToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dealers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch dealers');
      const data = await response.json();
      
      // Safely extract the array depending on your API structure
      setDealers(data.dealers || data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('rideFlexToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dealers/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve dealer');
      }

      // Update the UI locally so we don't have to re-fetch the entire list
      setDealers(dealers.map(dealer => 
        dealer._id === id || dealer.id === id 
          ? { ...dealer, isVerified: 'verified', status: 'approved' } 
          : dealer
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this dealer?")) return;
    try {
      const token = localStorage.getItem('rideFlexToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dealers/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject dealer');
      }

      setDealers(dealers.map(dealer => 
        dealer._id === id || dealer.id === id 
          ? { ...dealer, isVerified: 'rejected', status: 'rejected' } 
          : dealer
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="text-blue-600" size={36} />
        <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Manage Dealers</h2>
        </div>

        {loading && <div className="p-8 text-center text-gray-500 font-bold">Loading dealers...</div>}
        {error && <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="p-4 font-bold">Name / Shop</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">GST Number</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dealers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No dealers found.</td>
                  </tr>
                ) : (
                  dealers.map((dealer) => {
                    const id = dealer._id || dealer.id;
                    const isApproved = dealer.isVerified === 'verified' || dealer.status === 'approved';
                const isRejected = dealer.isVerified === 'rejected' || dealer.status === 'rejected';
                const isPending = !isApproved && !isRejected;
                    
                    return (
                      <tr key={id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-gray-800">{dealer.name}</div>
                          <div className="text-sm text-gray-500">{dealer.shopName || 'N/A'}</div>
                        </td>
                        <td className="p-4 text-gray-600">{dealer.email}</td>
                        <td className="p-4 text-gray-600 font-mono text-sm">{dealer.gstNumber || 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            isApproved ? 'bg-green-100 text-green-700' : 
                            isRejected ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(id)}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors text-sm"
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(id)}
                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-sm"
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}