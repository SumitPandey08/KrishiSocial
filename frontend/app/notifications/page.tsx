'use client';

import React from 'react';
import { Heart, MessageCircle, UserPlus, AlertTriangle, BadgeCheck, BellOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    user: 'Ramesh Kumar',
    content: 'liked your post about Organic Fertilizers',
    time: '5m ago',
    unread: true,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '2',
    type: 'comment',
    user: 'Suresh Patil',
    content: 'commented on your question: "Great advice, thank you!"',
    time: '1h ago',
    unread: true,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '3',
    type: 'follow',
    user: 'Anil Deshmukh',
    content: 'started following you',
    time: '2h ago',
    unread: false,
    avatar: 'https://via.placeholder.com/50',
  },
  {
    id: '4',
    type: 'alert',
    user: 'Krishi-Social',
    content: 'Extreme weather alert for your region. Check Mausam section.',
    time: '5h ago',
    unread: false,
    icon: 'warning',
  },
  {
    id: '5',
    type: 'expert',
    user: 'Dr. Verma (Expert)',
    content: 'answered your question about Wheat rust',
    time: '1d ago',
    unread: false,
    avatar: 'https://via.placeholder.com/50',
  },
];

export default function NotificationsPage() {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={12} className="fill-[#FF3040] text-[#FF3040]" />;
      case 'comment': return <MessageCircle size={12} className="fill-[#3B82F6] text-[#3B82F6]" />;
      case 'follow': return <UserPlus size={12} className="text-[#10B981]" />;
      case 'alert': return <AlertTriangle size={12} className="text-[#F59E0B]" />;
      case 'expert': return <BadgeCheck size={12} className="text-[#D4AF37]" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="p-1 text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-black text-gray-900">Notifications</h1>
        <button className="text-xs font-bold text-[#2E7D32]">Mark all read</button>
      </div>

      <div className="flex flex-col">
        {NOTIFICATIONS.map((item) => (
          <button 
            key={item.id}
            className={cn(
              "flex items-center gap-4 p-4 text-left border-b border-gray-50 transition-colors active:bg-gray-50",
              item.unread && "bg-[#F7FDF7]"
            )}
          >
            <div className="relative flex-shrink-0">
              {item.avatar ? (
                <img src={item.avatar} alt={item.user} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <AlertTriangle size={24} />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                {getIcon(item.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-tight">
                <span className="font-bold text-gray-900">{item.user}</span> {item.content}
              </p>
              <p className="text-[11px] font-medium text-gray-400 mt-1">{item.time}</p>
            </div>

            {item.unread && <div className="w-2 h-2 rounded-full bg-[#2E7D32] flex-shrink-0 ml-2" />}
          </button>
        ))}

        {NOTIFICATIONS.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <BellOff size={60} className="text-gray-300 mb-4" />
            <p className="text-base font-bold text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
