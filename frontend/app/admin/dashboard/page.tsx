'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getAdminStats } from '@/services/adminService';
import { Users, FileText, Users2, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalCommunities: number;
  pendingCommunities: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'bg-purple-50 text-purple-600' },
    { label: 'Approved Communities', value: stats?.totalCommunities || 0, icon: Users2, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Requests', value: stats?.pendingCommunities || 0, icon: Clock, color: 'bg-orange-50 text-orange-600', link: '/admin/community-requests' },
  ];

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto p-4 lg:p-8 min-h-screen pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-bold mt-1">Monitor site statistics and manage requests.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.color}`}>
                    <card.icon size={24} />
                  </div>
                  {card.link && (
                    <Link href={card.link} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ArrowRight size={20} />
                    </Link>
                  )}
                </div>
                <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40" />
                <h2 className="text-2xl font-black mb-4 relative z-10">Quick Actions</h2>
                <div className="space-y-4 relative z-10">
                    <Link 
                        href="/admin/community-requests"
                        className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors group"
                    >
                        <span className="font-bold">Manage Community Requests</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                        href="/admin/users"
                        className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors group"
                    >
                        <span className="font-bold">Manage User Roles</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
