import React from 'react'
import { useRouter } from 'next/navigation';
import { usePeer } from '@/hooks/usePeer';
import { useSocket } from '@/context/SocketContext';
import { EVENTS } from '@/utils/event.constants';
import { useEffect, useState } from 'react';
import { getCallDetails , toggleParticipate } from '@/services/callService';


// component to show ring or calling state based on the call status an also to accept or reject the call
const RingOrCalling = ({ callId, userId, isInitiator = false }: { callId: string; userId: string; isInitiator?: boolean }) => {
    const router = useRouter();
    const [isActiveCall, setIsActiveCall] = React.useState(false);
    const { socket, isConnected } = useSocket();
    const [remotePeerId, setRemotePeerId] = React.useState('');
    const [isAcceptingCall, setIsAcceptingCall] = React.useState(false);
    const [isRejectingCall, setIsRejectingCall] = React.useState(false);
    const { peerId, localStream, remoteStream } = usePeer(userId, socket);
    const [callDetails, setCallDetails] = useState<any>(null);

    useEffect(() => {
        const fetchCallDetails = async () => {
            if (callId) {
                const details = await getCallDetails(callId);
                setCallDetails(details);
            }
        };

        fetchCallDetails();
    }, [callId]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleIncomingCall = (payload: any) => {
            const incomingRemotePeerId = payload?.remotePeerId || '';
            const incomingCallId = payload?.call?._id || payload?.call?.id || payload?.callId || '';

            if (incomingRemotePeerId) {
                setRemotePeerId(incomingRemotePeerId);
            }

            if (incomingCallId) {
                setCallDetails((prev: any) => ({ ...prev, callId: incomingCallId }));
            }
        };

        socket.on(EVENTS.CALL_INITIATED, handleIncomingCall);

        socket.on(EVENTS.CALL_ENDED, () => {
            setIsActiveCall(false);
            router.push(`/charcha/${userId}`);
        });

        return () => {
            if (socket) {
                socket.off(EVENTS.CALL_INITIATED, handleIncomingCall);
                socket.off(EVENTS.CALL_ENDED);
            }
        };
    }, [socket, isConnected, userId]);

    const handleAcceptCall = async () => {
        setIsAcceptingCall(true);
        await toggleParticipate(callId, userId, 'accept');
        setIsActiveCall(true);
        router.push(`/charcha/${userId}/call/${callId}`);
    };
    
    const handleRejectCall = async () => {
        setIsRejectingCall(true);
        await toggleParticipate(callId, userId, 'reject');
        setIsActiveCall(false);
        router.push(`/charcha/${userId}`);
    };

    //end call will be in video and audio component where the call is active and user can end the call

  return (
    <div className="rounded-2xl p-4 bg-white">
        {isActiveCall ? (
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-900">Call is active</p>
                    <p className="text-xs text-gray-500">Connected with {remotePeerId || 'the other participant'}</p>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Live
                </div>
            </div>
        ) : isInitiator ? (
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-gray-900">Calling...</p>
                    <p className="text-xs text-gray-500">Waiting for the other person to answer</p>
                </div>
                <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Ringing
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-gray-900">Incoming call</p>
                    <p className="text-xs text-gray-500">{callDetails?.initiator?.name || callDetails?.initiatorName || 'Someone is calling you'}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleAcceptCall}
                        disabled={isAcceptingCall}
                        className="rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        {isAcceptingCall ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                        onClick={handleRejectCall}
                        disabled={isRejectingCall}
                        className="rounded-full bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60"
                    >
                        {isRejectingCall ? 'Rejecting...' : 'Reject'}
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default RingOrCalling