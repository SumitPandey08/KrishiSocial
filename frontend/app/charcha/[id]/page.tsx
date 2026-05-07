'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { getCommunity } from '@/services/communityService';
import { createChat, getChatMessages } from '@/services/chatService';
import { sendMessage } from '@/services/messageService';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { EVENTS } from '@/utils/event.constants';
import { 
  Send, 
  ArrowLeft, 
  Users, 
  Loader2, 
  Image as ImageIcon, 
  Paperclip,
  User as UserIcon
} from 'lucide-react';
import Image from 'next/image';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
  };
  content: string;
  messageType: string;
  mediaUrl?: string;
  createdAt: string;
}

export default function CommunityChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  
  const [community, setCommunity] = useState<any>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && chat?._id) {
      // Join the chat room
      socket.emit(EVENTS.JOIN_CHAT, { chatId: chat._id });

      // Listen for new messages
      socket.on(EVENTS.NEW_MESSAGE, (newMessage: Message) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      return () => {
        socket.emit(EVENTS.LEAVE_CHAT, { chatId: chat._id });
        socket.off(EVENTS.NEW_MESSAGE);
      };
    }
  }, [socket, chat]);

  const fetchData = async () => {
    try {
      const communityData = await getCommunity(id as string);
      setCommunity(communityData);

      // Get or create chat for this community
      const chatData = await createChat({
        chatName: communityData.name,
        chatType: 'community',
        communityId: communityData._id,
        participants: [] // Backend handles adding the current user
      });
      setChat(chatData);

      // Fetch existing messages
      const messagesData = await getChatMessages(chatData._id);
      setMessages(messagesData.reverse()); // Backend sends desc, we want asc for display
    } catch (error) {
      console.error("Failed to fetch chat data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !chat || sending) return;

    setSending(true);
    try {
      // We emit via socket for real-time
      if (socket) {
        socket.emit(EVENTS.NEW_MESSAGE, {
          chatId: chat._id,
          content: messageText,
          messageType: 'text'
        });
        setMessageText('');
      } else {
        // Fallback to API if socket not connected
        const newMessage = await sendMessage({
          chatId: chat._id,
          content: messageText,
          messageType: 'text'
        });
        setMessages((prev) => [...prev, newMessage]);
        setMessageText('');
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-green-500" size={48} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto bg-white min-h-[calc(100vh-64px)] flex flex-col shadow-sm border-x border-gray-100">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-bold">
                {community?.avatar ? (
                  <Image src={community.avatar} alt={community.name} width={48} height={48} className="rounded-2xl" />
                ) : (
                  <Users size={24} />
                )}
              </div>
              <div>
                <h1 className="font-black text-gray-900">{community?.name}</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <p className="text-xs font-bold text-gray-400">
                    {isConnected ? 'Live Discussion' : 'Connecting...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
          {messages.map((msg, index) => {
            const isOwnMessage = msg.sender._id === user?.id;
            const showSender = index === 0 || messages[index - 1].sender._id !== msg.sender._id;

            return (
              <div key={msg._id} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                {!isOwnMessage && showSender && (
                  <span className="text-[10px] font-black text-gray-400 mb-1 ml-11 uppercase tracking-widest">
                    {msg.sender.name}
                  </span>
                )}
                <div className={`flex items-end gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwnMessage && (
                    <div className="w-8 h-8 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 mb-1">
                      {msg.sender.profilePicture ? (
                        <Image src={msg.sender.profilePicture} alt={msg.sender.name} width={32} height={32} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <UserIcon size={16} />
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-[24px] font-bold text-sm shadow-sm ${
                    isOwnMessage 
                    ? 'bg-green-500 text-white rounded-tr-none shadow-green-100' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.content}
                    <div className={`text-[9px] mt-1 font-bold ${isOwnMessage ? 'text-green-100' : 'text-gray-300'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button type="button" className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">
              <ImageIcon size={20} />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                placeholder="Type your message..."
                className="w-full pl-6 pr-12 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!messageText.trim() || sending}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-all disabled:opacity-50 shadow-lg shadow-green-100"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
