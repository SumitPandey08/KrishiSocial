'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getCommunities, createCommunity, joinCommunity, leaveCommunity } from '@/services/communityService';
import { getUserChats } from '@/services/chatService';
import { Users2, Plus, Search, Loader2, User as UserIcon, MessageSquare, Sparkles, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface Community {
  _id: string;
  name: string;
  description: string;
  creator: {
    _id: string;
    username: string;
    name: string;
    profilePicture: string;
  };
  members: string[];
  tags: string[];
  avatar?: string;
}

interface Chat {
  _id: string;
  chatName: string;
  chatType: 'personal' | 'group' | 'community';
  participants: any[];
  latestMessage?: any;
  communityId?: string;
}

export default function CharchaPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('community');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [personalChats, setPersonalChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'community') {
      fetchCommunities();
    } else {
      fetchPersonalChats();
    }
  }, [activeTab]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalChats = async () => {
    setLoading(true);
    try {
      const data = await getUserChats();
      setPersonalChats(data.filter((chat: Chat) => chat.chatType === 'personal'));
    } catch (error) {
      console.error("Failed to fetch personal chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(t => t !== '');
      await createCommunity({ name, description, tags: tagList });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      setTags('');
      fetchCommunities();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create community");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinLeave = async (community: Community) => {
    if (!user) return;
    const isMember = community.members.includes(user.id);
    try {
      if (isMember) {
        await leaveCommunity(community._id);
      } else {
        await joinCommunity(community._id);
      }
      fetchCommunities();
    } catch (error) {
      console.error("Failed to toggle membership:", error);
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto p-4 sm:p-6 min-h-screen pb-28 bg-slate-50/40">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Community Forums & Chats
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">Charcha Discussions</h1>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus size={16} strokeWidth={3} />
            Create Community
          </button>
        </div>

        {/* Tab Navigation Pills */}
        <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit mb-8 border border-slate-200/60">
          <button 
            onClick={() => setActiveTab('community')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'community' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users2 size={16} /> Communities ({communities.length})
          </button>

          <button 
            onClick={() => setActiveTab('personal')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'personal' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={16} /> Personal Chats ({personalChats.length})
          </button>
        </div>

        {activeTab === 'community' ? (
          <>
            {/* Search Bar */}
            <div className="mb-6 relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search community forums..." 
                className="pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl w-full text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 shadow-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-56 bg-white rounded-3xl border border-slate-100 p-6 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCommunities.map((community) => {
                  const isMember = user ? community.members.includes(user.id) : false;
                  
                  return (
                    <div 
                      key={community._id} 
                      className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                            <Users2 size={24} />
                          </div>

                          <button 
                            onClick={() => handleJoinLeave(community)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                              isMember 
                                ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600' 
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                            }`}
                          >
                            {isMember ? 'Joined' : 'Join'}
                          </button>
                        </div>

                        <Link href={`/charcha/${community._id}`} className="block group-hover:text-emerald-700">
                          <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{community.name}</h3>
                          <p className="text-xs font-medium text-slate-500 line-clamp-3 leading-relaxed">{community.description}</p>
                        </Link>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                            {community.creator?.profilePicture ? (
                              <Image src={community.creator.profilePicture} alt={community.creator.name} width={28} height={28} className="object-cover" />
                            ) : (
                              <UserIcon size={14} className="text-slate-400" />
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-400">@{community.creator?.username || 'admin'}</span>
                        </div>

                        <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {community.members.length} members
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : personalChats.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <MessageCircle size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900">No Personal Chats Yet</h3>
                <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                  Connect with experts or other farmers from communities to start 1-on-1 chats.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {personalChats.map((chat) => {
                  const otherParticipant = chat.participants.find(p => p._id !== user?.id);
                  return (
                    <Link 
                      href={`/charcha/${chat._id}`}
                      key={chat._id} 
                      className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-emerald-800 font-black">
                        {otherParticipant?.name?.[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-900">{otherParticipant?.name || 'User'}</h4>
                        <p className="text-xs font-medium text-slate-500 truncate">{chat.latestMessage?.content || 'No messages yet'}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create Community Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
            <div className="bg-white rounded-3xl w-full max-w-md relative z-10 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Create Community</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Community Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Organic Wheat Farmers"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 outline-none focus:border-emerald-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Description</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="What is this community about?"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 outline-none focus:border-emerald-600 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

                <button 
                  type="submit" 
                  disabled={creating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="animate-spin" size={16} /> : 'Submit Community'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
