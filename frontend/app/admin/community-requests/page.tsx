'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getCommunityRequests, updateCommunityStatus } from '@/services/adminService';
import { Check, X, User, Users2, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CommunityRequest {
  _id: string;
  name: string;
  description: string;
  creator: {
    name: string;
    username: string;
    profilePicture: string;
  };
  createdAt: string;
  avatar: string;
}

export default function CommunityRequests() {
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getCommunityRequests();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const data = await updateCommunityStatus(id, status);
      if (data.success) {
        setRequests(prev => prev.filter(req => req._id !== id));
      }
    } catch (error) {
      console.error(`Failed to ${status} community:`, error);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-screen-md mx-auto p-4 lg:p-8 min-h-screen pb-24">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/dashboard" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Community Requests</h1>
                <p className="text-gray-500 font-bold mt-1">Approve or reject new community proposals.</p>
            </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 hover:border-gray-200 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-gray-50 overflow-hidden border border-gray-100">
                      {request.avatar ? (
                        <img src={request.avatar} alt={request.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Users2 size={32} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{request.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
                        <Calendar size={12} />
                        Requested {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 font-medium leading-relaxed mb-8">
                  {request.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                        <img 
                            src={request.creator.profilePicture || "https://via.placeholder.com/150"} 
                            alt={request.creator.username} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-900">{request.creator.name}</p>
                        <p className="text-[10px] font-bold text-gray-400">@{request.creator.username}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                        onClick={() => handleAction(request._id, 'rejected')}
                        className="h-12 px-6 bg-red-50 text-red-600 font-black rounded-2xl uppercase tracking-widest hover:bg-red-100 transition-colors active:scale-95 flex items-center gap-2"
                    >
                        <X size={18} />
                        <span>Reject</span>
                    </button>
                    <button 
                        onClick={() => handleAction(request._id, 'approved')}
                        className="h-12 px-6 bg-[#2E7D32] text-white font-black rounded-2xl uppercase tracking-widest hover:bg-[#1B5E20] transition-colors shadow-lg shadow-green-900/20 active:scale-95 flex items-center gap-2"
                    >
                        <Check size={18} />
                        <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users2 size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900">All caught up!</h3>
            <p className="text-gray-500 font-bold mt-2">No pending community requests at the moment.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
