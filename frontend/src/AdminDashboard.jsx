import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { CheckCircle, XCircle, ShieldCheck, Bell, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pendingCount, setPendingCount] = useState(0);
  const [showPendingAlert, setShowPendingAlert] = useState(true);

  useEffect(() => {
    fetchDealers();
    fetchPendingCount();

    // Poll so newly registered sellers show up without manual refresh
    const intervalId = setInterval(() => {
      fetchDealers({ silent: true });
      fetchPendingCount();
    }, 15000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPendingCount = async () => {
    try {
      const token = localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');
      if (!token) return;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dealers?approvalStatus=pending`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch pending dealers');

      const data = await response.json();
      const list = data.dealers || data.data || [];
      setPendingCount(Array.isArray(list) ? list.length : 0);
    } catch {
      // don't hard-fail the whole dashboard if count polling fails
    }
  };

  const fetchDealers = async ({ silent = false } = {}) => {
    try {
      const token = localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');
      if (!token) {
        window.location.href = '/auth';
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dealers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch dealers');
      const data = await response.json();
      setDealers(data.dealers || data.data || data);
    } catch (err) {
      setError(err.message || 'Unable to load dealers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (status === 'rejected' && !window.confirm('Are you sure you want to reject this dealer?')) {
      return;
    }

    try {
      const token = localStorage.getItem('rideFlexToken') || sessionStorage.getItem('rideFlexToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dealers/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${status} dealer`);
      }

      setDealers(dealers.map((dealer) => (
        dealer._id === id || dealer.id === id
          ? { ...dealer, approvalStatus: status, isVerified: status === 'approved' }
          : dealer
      )));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {showPendingAlert && pendingCount > 0 && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-yellow-700" />
              <span className="font-bold text-yellow-900">{pendingCount} seller(s) waiting for approval</span>
            </div>
            <div className="text-sm text-yellow-800 mt-1">
              Please review the pending registrations below.
            </div>
          </div>
          <button
            onClick={() => setShowPendingAlert(false)}
            className="text-yellow-800 hover:text-yellow-900 font-bold"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="text-blue-600" size={36} />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Review and approve seller dealer registrations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Pending Dealer Approvals</h2>
        </div>
        {loading && <div className="p-8 text-center text-gray-500 font-bold">Loading dealers...</div>}
        {error && <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="p-4 font-bold">Dealer</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Location</th>
                  <th className="p-4 font-bold">GST</th>
                  <th className="p-4 font-bold">Documents</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dealers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">No dealers found.</td>
                  </tr>
                ) : (
                  dealers.map((dealer) => {
                    const id = dealer._id || dealer.id;
                    const status = dealer.approvalStatus || 'pending';
                    const isApproved = status === 'approved';
                    const isRejected = status === 'rejected';

                    return (
                      <tr key={id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-gray-800">{dealer.user?.name || dealer.name}</div>
                          <div className="text-sm text-gray-500">{dealer.shopName || 'N/A'}</div>
                        </td>
                        <td className="p-4 text-gray-600">{dealer.user?.email || dealer.email}</td>
                        <td className="p-4 text-gray-600 text-sm">
                          <div>{dealer.city || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{dealer.pincode || 'No pincode'}</div>
                        </td>
                        <td className="p-4 text-gray-600 font-mono text-sm">{dealer.gstNumber || 'N/A'}</td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {dealer.idProof ? (
                              <a href={dealer.idProof} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                <FileText size={14} /> ID PDF
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">ID missing</span>
                            )}
                            {dealer.gstProof ? (
                              <a href={dealer.gstProof} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                <FileText size={14} /> GST PDF
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">GST missing</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isApproved ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          {!isApproved && !isRejected && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(id, 'approved')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                              >
                                <CheckCircle size={16} /> Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(id, 'rejected')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                              >
                                <XCircle size={16} /> Reject
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
