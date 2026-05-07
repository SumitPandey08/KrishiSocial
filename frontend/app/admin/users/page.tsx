'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { getUsers, updateUserRole } from '@/services/adminService';
import { User as UserIcon, Shield, Check, X, Search } from 'lucide-react';
import Image from 'next/image';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  profilePicture: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const roles = ["farmer", "expert", "krishi_center", "government", "admin"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const data = await updateUserRole(userId, newRole);
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto p-4 lg:p-8 min-h-screen pb-24">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage User Roles</h1>
            <p className="text-gray-500 font-bold mt-1">Change user permissions and promote members.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {user.profilePicture ? (
                              <Image 
                                src={user.profilePicture} 
                                alt={user.name} 
                                fill 
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <UserIcon size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-black text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 font-bold">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-red-100 text-red-600' :
                          user.role === 'expert' ? 'bg-blue-100 text-blue-600' :
                          user.role === 'government' ? 'bg-purple-100 text-purple-600' :
                          user.role === 'krishi_center' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none"
                          value={user.role}
                          disabled={updatingId === user._id}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        >
                          {roles.map(role => (
                            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center text-gray-500 font-bold">
                No users found.
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
