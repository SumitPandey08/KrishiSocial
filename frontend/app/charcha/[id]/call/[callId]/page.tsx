'use client';

import { usePeer } from "@/hooks/usePeer";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { EVENTS } from "@/utils/event.constants";
import { getCallDetails, toggleParticipate } from "@/services/callService";
import { ArrowLeft, Mic, MicOff, PhoneOff, Video, VideoOff, Loader2 } from "lucide-react";

const CallPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string; // Chat ID
    const callId = params?.callId as string; // Call MongoDB ID
    const { user } = useAuth();
    const { socket, isConnected } = useSocket();

    const [remotePeerId, setRemotePeerId] = useState('');
    const [callData, setCallData] = useState<any>(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [callEnded, setCallEnded] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const { peerId, localStream, remoteStream, startLocalStream, makeCall, endCall } = usePeer(
        user?.id || id,
        socket
    );

    // Fetch initial call info
    useEffect(() => {
        if (!callId) return;

        const fetchDetails = async () => {
            try {
                const details = await getCallDetails(callId);
                setCallData(details);
                if (details?.callStatus === 'ended' || details?.callStatus === 'rejected' || details?.callStatus === 'busy') {
                    setCallEnded(true);
                    setTimeout(() => router.push(`/charcha/${id}`), 2000);
                }
            } catch (err) {
                console.error("Error fetching call details:", err);
            }
        };

        fetchDetails();
    }, [callId, id, router]);

    // Start local audio/video stream
    useEffect(() => {
        if (!socket || !isConnected || !id) return;
        startLocalStream();
    }, [socket, isConnected, id, startLocalStream]);

    // Bind local stream to video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.muted = true;
            localVideoRef.current.play().catch(() => undefined);
        }
    }, [localStream]);

    // Bind remote stream to video element
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(() => undefined);
            setIsCallActive(true);
        }
    }, [remoteStream]);

    // Join call room and announce peerId
    useEffect(() => {
        if (!socket || !isConnected || !callId || !peerId) return;

        console.log("Emitting JOIN_CALL for callId:", callId, "peerId:", peerId);
        socket.emit(EVENTS.JOIN_CALL, {
            callId,
            userId: user?.id,
            peerId,
        });

        return () => {
            socket.emit(EVENTS.LEAVE_CALL, {
                callId,
                userId: user?.id,
                peerId,
            });
        };
    }, [socket, isConnected, callId, peerId, user?.id]);

    // Listen for socket events
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleUserJoinedCall = (payload: any) => {
            const incomingCallId = payload?.callId;
            if (incomingCallId && incomingCallId !== callId) return;

            const incomingRemotePeerId = payload?.peerId;
            if (incomingRemotePeerId && incomingRemotePeerId !== peerId) {
                console.log("Remote peer joined call room:", incomingRemotePeerId);
                setRemotePeerId(incomingRemotePeerId);
                setIsCallActive(true);
                makeCall(incomingRemotePeerId);
            }
        };

        const handleUserLeftCall = (payload: any) => {
            const leftCallId = payload?.callId;
            if (!leftCallId || leftCallId === callId) {
                setCallEnded(true);
                endCall();
                setTimeout(() => {
                    router.push(`/charcha/${id}`);
                }, 1000);
            }
        };

        const handleCallInitiated = (payload: any) => {
            const incomingCallId = payload?.callId || payload?.call?._id;
            if (incomingCallId && incomingCallId !== callId) return;

            const incomingRemotePeerId = payload?.remotePeerId || payload?.peerId || payload?.initiatorPeerId || '';
            if (incomingRemotePeerId && incomingRemotePeerId !== peerId) {
                setRemotePeerId(incomingRemotePeerId);
                setIsCallActive(true);
                makeCall(incomingRemotePeerId);
            }
        };

        const handleStatusUpdated = (payload: any) => {
            const updatedCallId = payload?.callId || payload?.call?._id;
            if (updatedCallId && updatedCallId !== callId) return;

            const action = payload?.action || payload?.call?.callStatus;
            if (action === 'ended' || action === 'rejected' || action === 'decline') {
                setCallEnded(true);
                endCall();
                setTimeout(() => {
                    router.push(`/charcha/${id}`);
                }, 1000);
            } else if (action === 'accepted' || action === 'accept') {
                setIsCallActive(true);
                // Re-broadcast our peerId to the room in case caller joined first
                if (peerId) {
                    socket.emit(EVENTS.JOIN_CALL, { callId, userId: user?.id, peerId });
                }
            }
        };

        const handleCallEndedEvent = (payload: any) => {
            const endedCallId = payload?.callId;
            if (!endedCallId || endedCallId === callId) {
                setCallEnded(true);
                endCall();
                setTimeout(() => {
                    router.push(`/charcha/${id}`);
                }, 1000);
            }
        };

        socket.on(EVENTS.USER_JOINED_CALL, handleUserJoinedCall);
        socket.on(EVENTS.USER_LEFT_CALL, handleUserLeftCall);
        socket.on(EVENTS.CALL_INITIATED, handleCallInitiated);
        socket.on(EVENTS.CALL_STATUS_UPDATED, handleStatusUpdated);
        socket.on(EVENTS.CALL_ENDED, handleCallEndedEvent);

        return () => {
            socket.off(EVENTS.USER_JOINED_CALL, handleUserJoinedCall);
            socket.off(EVENTS.USER_LEFT_CALL, handleUserLeftCall);
            socket.off(EVENTS.CALL_INITIATED, handleCallInitiated);
            socket.off(EVENTS.CALL_STATUS_UPDATED, handleStatusUpdated);
            socket.off(EVENTS.CALL_ENDED, handleCallEndedEvent);
        };
    }, [socket, isConnected, callId, id, peerId, makeCall, endCall, router, user?.id]);

    // Track audio/video track state
    useEffect(() => {
        if (localStream) {
            localStream.getAudioTracks().forEach((track) => {
                track.enabled = isAudioEnabled;
            });

            localStream.getVideoTracks().forEach((track) => {
                track.enabled = isVideoEnabled;
            });
        }
    }, [localStream, isAudioEnabled, isVideoEnabled]);

    const toggleAudio = () => {
        if (!localStream) {
            startLocalStream();
            return;
        }
        setIsAudioEnabled((prev) => !prev);
    };

    const toggleVideo = () => {
        if (!localStream) {
            startLocalStream();
            return;
        }
        setIsVideoEnabled((prev) => !prev);
    };

    const handleEndCall = useCallback(async () => {
        setCallEnded(true);
        endCall();

        // 1. Notify via socket
        if (socket) {
            socket.emit(EVENTS.TOGGLE_PARTICIPATE, {
                callId,
                userId: user?.id,
                action: 'end'
            });
            socket.emit(EVENTS.CALL_ENDED, {
                chatId: id,
                callId,
                userId: user?.id
            });
        }

        // 2. REST API fallback
        try {
            if (callId && user?.id) {
                await toggleParticipate(callId, user.id, 'end');
            }
        } catch (err) {
            console.error("Error updating call status on end:", err);
        }

        router.push(`/charcha/${id}`);
    }, [callId, endCall, id, router, socket, user?.id]);

    const callerName = callData?.initiator?.name || 'Call';

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto max-w-6xl px-4 py-4">
                <div className="mb-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleEndCall}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-300">
                            {callerName}
                        </span>
                        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {callEnded
                                ? 'Call Ended'
                                : isConnected
                                    ? (remoteStream ? 'Connected' : 'Ringing / Connecting...')
                                    : 'Offline'}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-2xl">
                    <div className="relative h-[72vh] min-h-[420px] bg-slate-950">
                        {/* Remote Video Stream */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            muted={false}
                            className={`h-full w-full object-cover ${remoteStream ? 'block' : 'hidden'}`}
                        />

                        {/* Placeholder when remote stream is not yet active */}
                        {!remoteStream && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white/80">
                                        {callData?.callStatus === 'busy' ? '⏳' : callEnded ? '❌' : (callerName?.slice(0, 2)?.toUpperCase() || 'U')}
                                    </div>
                                    <p className="text-lg font-semibold text-white">
                                        {callData?.callStatus === 'busy'
                                            ? 'User is busy on another call'
                                            : callEnded
                                                ? 'Call has ended'
                                                : 'Waiting for connection...'}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        {callData?.callStatus === 'busy'
                                            ? 'The participant is on another line. Redirecting...'
                                            : callEnded
                                                ? 'Redirecting back to chat...'
                                                : remotePeerId
                                                    ? `Connecting to peer...`
                                                    : `Call ID: ${callId?.slice(-6) || ''}`}
                                    </p>
                                    {!callEnded && callData?.callStatus !== 'busy' && (
                                        <div className="mt-4 flex justify-center">
                                            <Loader2 className="animate-spin text-emerald-400" size={24} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Local Video Thumbnail */}
                        <div className="absolute bottom-4 right-4 h-32 w-24 overflow-hidden rounded-2xl border border-white/15 bg-slate-800 shadow-xl md:h-40 md:w-28">
                            {localStream ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-slate-700 text-xs font-semibold text-slate-200">
                                    Camera
                                </div>
                            )}

                            {!isVideoEnabled && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-xs font-semibold text-white">
                                    Video off
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="flex items-center justify-center gap-4 bg-slate-950 p-4">
                        <button
                            type="button"
                            onClick={toggleAudio}
                            className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${
                                isAudioEnabled
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                    : 'border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                            }`}
                            title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
                        >
                            {isAudioEnabled ? <Mic size={22} /> : <MicOff size={22} />}
                        </button>

                        <button
                            type="button"
                            onClick={toggleVideo}
                            className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${
                                isVideoEnabled
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                    : 'border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                            }`}
                            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                        >
                            {isVideoEnabled ? <Video size={22} /> : <VideoOff size={22} />}
                        </button>

                        <button
                            type="button"
                            onClick={handleEndCall}
                            className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/50 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            title="End Call"
                        >
                            <PhoneOff size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallPage;
