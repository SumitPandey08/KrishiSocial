'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getCommunities, createCommunity, joinCommunity, leaveCommunity } from '@/services/communityService';
import { Users2, Plus, Search, Loader2, Check, ArrowRight, User as UserIcon } from 'lucide-react';
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

export default function CharchaPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
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
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
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
      fetchCommunities(); // Refresh list (it might be pending though)
      alert("Community creation request submitted!");
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
      <div className="max-w-screen-xl mx-auto p-4 lg:p-8 min-h-screen pb-24">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Charcha</h1>
            <p className="text-gray-500 font-bold mt-2 text-lg">Join communities, share knowledge, and grow together.</p>
            
            <div className="mt-6 relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                type="text" 
                placeholder="Find a community..." 
                className="pl-12 pr-4 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl w-full focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/10"
          >
            <Plus size={20} strokeWidth={3} />
            Create Community
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-100 rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => {
              const isMember = user ? community.members.includes(user.id) : false;
              
              return (
                <Link 
                  href={`/charcha/${community._id}`}
                  key={community._id} 
                  className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-500">
                      <Users2 size={28} />
                    </div>
                    <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleJoinLeave(community);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            isMember 
                            ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500' 
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
                        }`}
                    >
                        {isMember ? 'Joined' : 'Join'}
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900 mb-2">{community.name}</h3>
                  <p className="text-gray-500 font-bold text-sm line-clamp-3 mb-6 flex-grow">{community.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100">
                            {community.creator.profilePicture ? (
                                <Image src={community.creator.profilePicture} alt={community.creator.name} width={32} height={32} className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <UserIcon size={14} />
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-bold text-gray-400">By @{community.creator.username}</span>
                    </div>
                    <div className="text-xs font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                        {community.members.length} members
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Create Community Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="bg-white rounded-[40px] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">Create Community</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Community Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Organic Farming India"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="What is this community about?"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. wheat, organic, subsidy"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                  
                  {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                  
                  <button 
                    type="submit" 
                    disabled={creating}
                    className="w-full bg-green-500 text-white py-5 rounded-[24px] font-black text-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {creating ? <Loader2 className="animate-spin" /> : 'Create Community'}
                  </button>
                  
                  <p className="text-center text-xs text-gray-400 font-bold">
                    Farmers' requests require admin approval. Experts and Admins are auto-approved.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
