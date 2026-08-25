'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { getCommunity } from '@/services/communityService';
import { createChat, getChatMessages, getChatById } from '@/services/chatService';
import { sendMessage } from '@/services/messageService';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { EVENTS } from '@/utils/event.constants';
import { Loader2, Sprout } from 'lucide-react';
import { usePeer } from '@/hooks/usePeer';
import RingOrCalling from '@/components/call/RingOrCalling';
import { initiateCall } from '@/services/callService';

// Modular Charcha Components
import ChatHeader from '@/components/charcha/ChatHeader';
import CommunityDrawer from '@/components/charcha/CommunityDrawer';
import MessageList from '@/components/charcha/MessageList';
import MessageInput from '@/components/charcha/MessageInput';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
    role?: string;
  };
  content: string;
  messageType: string;
  mediaUrl?: string;
  createdAt: string;
}

const QUICK_TOPICS = [
  "🌾 Mandi Rate Query",
  "🌱 Crop Disease Help",
  "🧪 Fertilizer & Spray Advice",
  "🌦️ Weather & Sowing"
];

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isFarFromBottom);
  };

  // Call state & hooks
  const { peerId } = usePeer(user?.id || (id as string), socket);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callAlert, setCallAlert] = useState<string | null>(null);

  const handleCallButtonClick = async (callType: 'video' | 'audio' = 'video') => {
    const currentUserId = user?.id || (user as any)?._id;
    if (!currentUserId || !chat?._id || isCalling) return;

    setIsCalling(true);
    try {
      const res = await initiateCall(currentUserId, chat._id, callType);

      if (res?.isBusy) {
        setCallAlert(res.message || "User is currently busy on another call.");
        setTimeout(() => setCallAlert(null), 4000);
        return;
      }

      const activeCallId = res?.callId || res?.call?._id;

      if (socket && isConnected) {
        socket.emit(EVENTS.INITIATE_CALL, {
          initiatorId: currentUserId,
          chatId: chat._id,
          callType,
          peerId: peerId || undefined,
          callId: activeCallId,
        });
      }

      if (activeCallId) {
        router.push(`/charcha/${chat._id || id}/call/${activeCallId}`);
      }
    } catch (error: any) {
      console.error("Failed to initiate call via API, fallback to socket:", error);
      if (socket && isConnected) {
        socket.emit(EVENTS.INITIATE_CALL, {
          initiatorId: currentUserId,
          chatId: chat._id,
          callType,
          peerId: peerId || undefined,
        });
      }
    } finally {
      setIsCalling(false);
    }
  };

  // Socket call events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleIncomingCall = (payload: any) => {
      const incomingCallId = payload?.callId || payload?.call?._id;
      const callerId = payload?.call?.initiator?._id || payload?.call?.initiator;
      const isMyCall = callerId?.toString() === user?.id?.toString();

      if (isMyCall && incomingCallId) {
        router.push(`/charcha/${chat?._id || id}/call/${incomingCallId}`);
      } else if (!isMyCall && incomingCallId) {
        setIncomingCallData(payload);
        setIsReceivingCall(true);
      }
    };

    const handleCallBusy = (payload: any) => {
      setCallAlert(payload?.message || "User is currently busy on another call.");
      setTimeout(() => setCallAlert(null), 4000);
    };

    const handleCallStatusUpdated = (payload: any) => {
      const action = payload?.action || payload?.call?.callStatus;
      if (action === 'rejected' || action === 'ended' || action === 'decline' || action === 'busy') {
        setIsReceivingCall(false);
        setIncomingCallData(null);
      }
    };

    const handleCallEnded = () => {
      setIsReceivingCall(false);
      setIncomingCallData(null);
    };

    socket.on(EVENTS.CALL_INITIATED, handleIncomingCall);
    socket.on(EVENTS.CALL_BUSY, handleCallBusy);
    socket.on(EVENTS.CALL_STATUS_UPDATED, handleCallStatusUpdated);
    socket.on(EVENTS.CALL_ENDED, handleCallEnded);

    return () => {
      socket.off(EVENTS.CALL_INITIATED, handleIncomingCall);
      socket.off(EVENTS.CALL_BUSY, handleCallBusy);
      socket.off(EVENTS.CALL_STATUS_UPDATED, handleCallStatusUpdated);
      socket.off(EVENTS.CALL_ENDED, handleCallEnded);
    };
  }, [socket, isConnected, user?.id, chat?._id, id, router]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom(false);
  }, [messages.length]);

  useEffect(() => {
    if (socket && chat?._id) {
      socket.emit(EVENTS.JOIN_CHAT, { chatId: chat._id });

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
      setLoading(true);
      let currentChat = null;

      try {
        currentChat = await getChatById(id as string);
      } catch (error) {
        console.log("Not a direct chat ID, checking as community ID...");
      }

      if (!currentChat) {
        try {
          const communityData = await getCommunity(id as string);
          currentChat = await createChat({
            chatName: communityData.name,
            chatType: 'community',
            communityId: communityData._id,
            participants: []
          });
          if (currentChat && !currentChat.communityId && communityData) {
            currentChat.communityId = communityData;
          }
        } catch (error) {
          console.log("Not a community ID, checking as personal user ID...");
        }
      }

      if (!currentChat) {
        try {
          currentChat = await createChat({
            chatType: 'personal',
            participants: [id as string]
          });
        } catch (error) {
          console.error("Failed to fetch chat data:", error);
        }
      }

      if (currentChat) {
        setChat(currentChat);
        const messagesData = await getChatMessages(currentChat._id);
        setMessages(messagesData.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !chat || sending) return;

    const trimmedText = messageText.trim();
    setSending(true);
    try {
      if (socket && isConnected) {
        socket.emit(EVENTS.NEW_MESSAGE, {
          chatId: chat._id,
          content: trimmedText,
          messageType: 'text'
        });
        setMessageText('');
      } else {
        const newMessage = await sendMessage({
          chatId: chat._id,
          content: trimmedText,
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

  const handleSelectQuickTopic = (topic: string) => {
    setMessageText(topic + " - ");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2E7D32]">
            <Loader2 className="animate-spin" size={28} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-slate-900">Connecting to Charcha...</p>
            <p className="text-xs text-slate-500 font-medium">Loading live room messages</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!chat) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Sprout size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Discussion Room Not Found</h2>
            <p className="text-xs text-slate-500 max-w-sm">
              This discussion room may have expired or you don't have access permissions.
            </p>
          </div>
          <button
            onClick={() => router.push('/charcha')}
            className="px-6 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-green-900/20 cursor-pointer"
          >
            Back to Communities
          </button>
        </div>
      </AppLayout>
    );
  }

  const isCommunity = chat.chatType === 'community';
  const otherParticipant = chat.chatType === 'personal'
    ? chat.participants?.find((p: any) => p._id !== user?.id)
    : null;

  const chatTitle = isCommunity
    ? chat.communityId?.name || chat.chatName || 'Kisan Community'
    : otherParticipant?.name || 'Farmer Chat';

  const chatSubtitle = isCommunity
    ? `${chat.communityId?.members?.length || 0} Members`
    : `@${otherParticipant?.username || 'kisan'}`;

  const chatAvatar = isCommunity
    ? chat.communityId?.avatar
    : otherParticipant?.profilePicture;

  const shouldShowCallOverlay = isReceivingCall && incomingCallData;

  return (
    <AppLayout>
      {/* Toast Alert */}
      {callAlert && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-xs sm:text-sm font-bold text-amber-900 shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-2 animate-bounce">
            <span>⚠️</span>
            <span>{callAlert}</span>
          </div>
        </div>
      )}

      {/* Ringing Overlay */}
      {shouldShowCallOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md pointer-events-auto">
            <RingOrCalling
              chatId={chat?._id || (id as string)}
              incomingData={incomingCallData}
              onDismiss={() => {
                setIsReceivingCall(false);
                setIncomingCallData(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Full-Height Chat Container */}
      <div className="w-full max-w-4xl mx-auto h-[100dvh] md:h-[calc(100vh-1rem)] flex flex-col bg-white border-x border-slate-200 shadow-xl relative overflow-hidden">
        
        {/* Modular Header with Absolute Right Actions */}
        <ChatHeader
          chatTitle={chatTitle}
          chatSubtitle={chatSubtitle}
          chatAvatar={chatAvatar}
          isCommunity={isCommunity}
          isConnected={isConnected}
          isCalling={isCalling}
          showInfoDrawer={showInfoDrawer}
          onToggleInfoDrawer={() => setShowInfoDrawer(!showInfoDrawer)}
          onInitiateCall={handleCallButtonClick}
        />

        {/* Modular Community Info Drawer */}
        {isCommunity && showInfoDrawer && (
          <CommunityDrawer
            description={chat.communityId?.description}
            tags={chat.communityId?.tags}
            membersCount={chat.communityId?.members?.length}
            onClose={() => setShowInfoDrawer(false)}
          />
        )}

        {/* Modular Message Stream */}
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          isCommunity={isCommunity}
          chatTitle={chatTitle}
          quickTopics={QUICK_TOPICS}
          onSelectTopic={handleSelectQuickTopic}
          messagesEndRef={messagesEndRef}
          chatContainerRef={chatContainerRef}
          onScroll={handleScroll}
          showScrollBottom={showScrollBottom}
          onScrollToBottom={() => scrollToBottom(true)}
        />

        {/* Modular Input Dock with Quick Topics */}
        <MessageInput
          messageText={messageText}
          onChangeText={setMessageText}
          onSubmit={handleSendMessage}
          sending={sending}
          isCommunity={isCommunity}
          quickTopics={QUICK_TOPICS}
          onSelectTopic={handleSelectQuickTopic}
        />

      </div>
    </AppLayout>
  );
}
