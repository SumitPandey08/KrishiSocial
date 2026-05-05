'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { updateProfile, updateProfilePicture } from '@/services/userService';

function EditProfileContent() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [village, setVillage] = useState(user?.village || "");
  const [district, setDistrict] = useState(user?.district || "");
  const [state, setState] = useState(user?.state || "");
  const [farmSize, setFarmSize] = useState(user?.farmSize?.toString() || "0");
  const [farmingType, setFarmingType] = useState(user?.farmingType || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setVillage(user.village || "");
      setDistrict(user.district || "");
      setState(user.state || "");
      setFarmSize(user.farmSize?.toString() || "0");
      setFarmingType(user.farmingType || "");
      setProfilePicture(user.profilePicture || "");
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateProfile({
        name,
        bio,
        village,
        district,
        state,
        farmSize: Number(farmSize),
        farmingType
      });
      setUser(updatedUser);
      router.back();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const updatedUser = await updateProfilePicture(formData);
      setProfilePicture(updatedUser.profilePicture);
      if (user) {
        setUser({ ...user, profilePicture: updatedUser.profilePicture });
      }
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const cn = (...inputs: (string | boolean | undefined)[]) => inputs.filter(Boolean).join(' ');

  return (
    <div className="max-w-screen-md mx-auto min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="p-1 text-gray-900">
          <X size={24} />
        </button>
        <h1 className="text-lg font-black text-gray-900">Edit Profile</h1>
        <button 
          onClick={handleSave} 
          disabled={loading || uploading}
          className="text-base font-black text-[#2E7D32] disabled:opacity-50"
        >
          {loading ? "..." : "Save"}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="bg-gray-50 py-10 flex flex-col items-center">
         <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-sm bg-gray-200">
               <img 
                 src={profilePicture || "https://via.placeholder.com/150"} 
                 alt="avatar" 
                 className="w-full h-full object-cover"
               />
               {uploading && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                 </div>
               )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-9 h-9 bg-[#2E7D32] rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm transition-transform active:scale-90 disabled:opacity-50"
            >
               <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*"
            />
         </div>
         <button 
           onClick={() => fileInputRef.current?.click()}
           className="text-sm font-bold text-[#2E7D32] mt-4 uppercase tracking-wider"
         >
           {uploading ? "Uploading..." : "Change Profile Photo"}
         </button>
      </div>

      {/* Form */}
      <div className="p-6 space-y-8 bg-white">
         <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Personal Information</h3>
            <div className="space-y-6">
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-600 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/10"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-600 ml-1">Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full min-h-[100px] bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/10 resize-none"
                    placeholder="Tell us about your farming journey..."
                  />
               </div>
            </div>
         </section>

         <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Farm Details</h3>
            <div className="space-y-6">
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-600 ml-1">Farm Size (Acres)</label>
                  <input 
                    type="number" 
                    value={farmSize} 
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/10"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-600 ml-1">Farming Type</label>
                  <div className="flex flex-wrap gap-2">
                     {["Organic", "Traditional", "Hydroponic", "Mixed", "Other"].map((type) => (
                       <button
                         key={type}
                         onClick={() => setFarmingType(type)}
                         className={cn(
                           "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                           farmingType === type 
                             ? "bg-[#2E7D32] border-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/20" 
                             : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300"
                         ) as string}
                       >
                         {type}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <section>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Location</h3>
            <div className="space-y-6">
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-gray-600 ml-1">Village</label>
                  <input 
                    type="text" 
                    value={village} 
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/10"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                     <label className="text-[13px] font-bold text-gray-600 ml-1">District</label>
                     <input 
                       type="text" 
                       value={district} 
                       onChange={(e) => setDistrict(e.target.value)}
                       className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/10"
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[13px] font-bold text-gray-600 ml-1">State</label>
                     <input 
                       type="text" 
                       value={state} 
                       onChange={(e) => setState(e.target.value)}
                       className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#2E7D32]/10"
                     />
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <AppLayout>
      <EditProfileContent />
    </AppLayout>
  );
}
