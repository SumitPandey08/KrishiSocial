'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { EVENTS } from '@/utils/event.constants';
import { toggleParticipate, getCallDetails } from '@/services/callService';

interface RingOrCallingProps {
    chatId: string;
    incomingData?: any;
    onDismiss?: () => void;
}

// Component to show incoming call banner and accept/reject actions
const RingOrCalling = ({ chatId, incomingData, onDismiss }: RingOrCallingProps) => {
    const router = useRouter();
    const { user } = useAuth();
    const { socket, isConnected } = useSocket();

    const [isAcceptingCall, setIsAcceptingCall] = useState(false);
    const [isRejectingCall, setIsRejectingCall] = useState(false);
    const [callId, setCallId] = useState<string>(
        incomingData?.callId || incomingData?.call?._id || ''
    );
    const [callerName, setCallerName] = useState<string>(
        incomingData?.call?.initiator?.name || incomingData?.initiatorName || 'Incoming Call'
    );

    useEffect(() => {
        if (!incomingData) return;
        const cId = incomingData?.callId || incomingData?.call?._id || '';
        if (cId) setCallId(cId);

        if (incomingData?.call?.initiator?.name) {
            setCallerName(incomingData.call.initiator.name);
        }
    }, [incomingData]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleIncomingCall = (payload: any) => {
            const incomingCallId = payload?.callId || payload?.call?._id || '';
            if (incomingCallId) {
                setCallId(incomingCallId);
            }
            if (payload?.call?.initiator?.name) {
                setCallerName(payload.call.initiator.name);
            }
        };

        const handleCallStatusUpdated = (payload: any) => {
            const updatedCallId = payload?.callId || payload?.call?._id;
            if (updatedCallId && updatedCallId === callId) {
                const action = payload?.action || payload?.call?.callStatus;
                if (action === 'rejected' || action === 'ended' || action === 'decline') {
                    onDismiss?.();
                }
            }
        };

        const handleCallEnded = (payload: any) => {
            if (!payload?.callId || payload.callId === callId) {
                onDismiss?.();
            }
        };

        socket.on(EVENTS.CALL_INITIATED, handleIncomingCall);
        socket.on(EVENTS.CALL_STATUS_UPDATED, handleCallStatusUpdated);
        socket.on(EVENTS.CALL_ENDED, handleCallEnded);

        return () => {
            socket.off(EVENTS.CALL_INITIATED, handleIncomingCall);
            socket.off(EVENTS.CALL_STATUS_UPDATED, handleCallStatusUpdated);
            socket.off(EVENTS.CALL_ENDED, handleCallEnded);
        };
    }, [socket, isConnected, callId, onDismiss]);

    const handleAcceptCall = async () => {
        setIsAcceptingCall(true);

        const currentCallId = callId;
        const currentUserId = user?.id;

        if (socket && currentCallId) {
            socket.emit(EVENTS.TOGGLE_PARTICIPATE, {
                callId: currentCallId,
                userId: currentUserId,
                action: 'accept'
            });
        }

        if (currentCallId && currentUserId) {
            try {
                await toggleParticipate(currentCallId, currentUserId, 'accept');
            } catch (err) {
                console.error("Error accepting call:", err);
            }
        }

        if (currentCallId) {
            router.push(`/charcha/${chatId}/call/${currentCallId}`);
        } else {
            router.push(`/charcha/${chatId}`);
        }
    };

    const handleRejectCall = async () => {
        setIsRejectingCall(true);

        const currentCallId = callId;
        const currentUserId = user?.id;

        if (socket && currentCallId) {
            socket.emit(EVENTS.TOGGLE_PARTICIPATE, {
                callId: currentCallId,
                userId: currentUserId,
                action: 'decline'
            });
        }

        if (currentCallId && currentUserId) {
            try {
                await toggleParticipate(currentCallId, currentUserId, 'decline');
            } catch (err) {
                console.error("Error declining call:", err);
            }
        }

        setIsRejectingCall(false);
        onDismiss?.();
    };

    return (
        <div className="rounded-2xl p-4 bg-white shadow-xl border border-green-100">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-gray-900">Incoming call</p>
                    <p className="text-xs text-gray-500">{callerName}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleAcceptCall}
                        disabled={isAcceptingCall}
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition"
                    >
                        {isAcceptingCall ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                        onClick={handleRejectCall}
                        disabled={isRejectingCall}
                        className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-60 transition"
                    >
                        {isRejectingCall ? 'Rejecting...' : 'Reject'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RingOrCalling;