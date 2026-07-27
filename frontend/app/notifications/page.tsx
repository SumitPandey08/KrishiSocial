'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, ArrowLeft, Bug, Store, MessageSquare, Check, Trash2, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'pest' | 'mandi' | 'community' | 'system';
  isRead: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pest' | 'mandi' | 'community'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'High Risk Alert: Rice Blast & Leaf Spot',
      description: 'Humidity level in your region exceeds 85%. Perform preventative spray inspection immediately.',
      time: '10 mins ago',
      type: 'pest',
      isRead: false
    },
    {
      id: '2',
      title: 'Mandi Rate Increase: Wheat (Sarbati)',
      description: 'Modal price for Wheat increased by ₹120/Qtl in Indore APMC market today.',
      time: '1 hour ago',
      type: 'mandi',
      isRead: false
    },
    {
      id: '3',
      title: 'New Response in Organic Wheat Farmers',
      description: 'Expert Rajesh Kumar replied to your discussion thread on organic pest management.',
      time: '3 hours ago',
      type: 'community',
      isRead: true
    },
    {
      id: '4',
      title: 'Weather Advisory: Low Wind Window',
      description: 'Optimal wind conditions for crop spraying predicted between 4:00 PM and 6:00 PM today.',
      time: '5 hours ago',
      type: 'system',
      isRead: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);

  return (
    <AppLayout>
      <div className="max-w-screen-md mx-auto min-h-screen bg-slate-50/50 pb-28">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              Notifications & Alerts
              {notifications.some(n => !n.isRead) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </h1>
          </div>

          <button 
            onClick={markAllRead}
            className="text-xs font-bold text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Check size={14} /> Mark All Read
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { key: 'all', label: 'All Alerts' },
              { key: 'pest', label: 'Pest Warnings' },
              { key: 'mandi', label: 'Mandi Rates' },
              { key: 'community', label: 'Community' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  filter === tab.key 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filtered.map(item => (
              <div 
                key={item.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 flex items-start justify-between gap-4 group ${
                  !item.isRead 
                    ? 'bg-white border-emerald-200/80 shadow-xs ring-1 ring-emerald-500/10' 
                    : 'bg-white/80 border-slate-200/60 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    item.type === 'pest' ? 'bg-rose-100 text-rose-700' :
                    item.type === 'mandi' ? 'bg-emerald-100 text-emerald-700' :
                    item.type === 'community' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.type === 'pest' ? <Bug size={20} /> :
                     item.type === 'mandi' ? <Store size={20} /> :
                     item.type === 'community' ? <MessageSquare size={20} /> : <Bell size={20} />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 tracking-tight leading-snug">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{item.description}</p>
                    <span className="text-[10px] font-bold text-slate-400 block pt-1">{item.time}</span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Bell size={24} />
                </div>
                <h3 className="text-base font-black text-slate-900">No Notifications</h3>
                <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto">
                  You are all caught up! New crop alerts and market price updates will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
