'use client';

import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Globe, Users, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { createStory, StoryItem } from '@/services/storyService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (newStory: StoryItem) => void;
}

export default function CreateStoryModal({ isOpen, onClose, onStoryCreated }: CreateStoryModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'followers'>('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be under 50MB');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    setFileType(isVideo ? 'video' : 'image');
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    setError(null);
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image or video');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const created = await createStory({
        file: selectedFile,
        caption: caption.trim() || undefined,
        privacy,
      });

      handleClear();
      onStoryCreated(created);
      onClose();
    } catch (err: any) {
      console.error('Failed to create story:', err);
      setError(err?.response?.data?.message || 'Failed to publish story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h2 className="text-lg font-black text-gray-900">Add to Story</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Media Preview or Picker */}
          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors rounded-2xl h-64 flex flex-col items-center justify-center gap-3 cursor-pointer p-4 text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Select photo or video for your story</p>
                <p className="text-xs text-gray-400 mt-0.5">MP4, WEBM, JPG, PNG, WEBP (up to 50MB)</p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-[#2E7D32] text-white rounded-full text-xs font-bold shadow-md shadow-emerald-900/10 group-hover:bg-emerald-700 transition-colors"
              >
                Choose from Device
              </button>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-80 group">
              {fileType === 'video' ? (
                <video
                  src={previewUrl}
                  className="max-h-80 w-full object-contain"
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Story preview"
                  className="max-h-80 w-full object-contain"
                />
              )}

              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
                title="Change media"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Caption (Optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening in your farm today?..."
              maxLength={200}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Privacy Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Who can see this story?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrivacy('followers')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all',
                  privacy === 'followers'
                    ? 'bg-emerald-50 border-[#2E7D32] text-[#2E7D32]'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                <Users size={16} />
                <span>Followers Only</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('public')}
                className={cn(
                  'flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all',
                  privacy === 'public'
                    ? 'bg-emerald-50 border-[#2E7D32] text-[#2E7D32]'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                <Globe size={16} />
                <span>Public (Everyone)</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2',
                selectedFile && !loading
                  ? 'bg-[#2E7D32] hover:bg-emerald-700 text-white shadow-lg shadow-green-900/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sharing Story...</span>
                </>
              ) : (
                <span>Share Story</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
