import Peer, { MediaConnection } from "peerjs";
import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { EVENTS } from "@/utils/event.constants";

export const usePeer = (userId: string, socket: Socket | null) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [peerId, setPeerId] = useState('');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const currentCallRef = useRef<MediaConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerRef = useRef<Peer | null>(null);

    const startLocalStream = useCallback(async () => {
        if (localStreamRef.current && localStreamRef.current.active) {
            return localStreamRef.current;
        }

        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
            console.warn("Media devices API not available in this environment.");
            return null;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            setLocalStream(stream);
            return stream;
        } catch (error: any) {
            console.warn("Could not get video+audio stream, attempting audio only fallback...", error?.message || error);
            try {
                const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                localStreamRef.current = audioOnlyStream;
                setLocalStream(audioOnlyStream);
                return audioOnlyStream;
            } catch (audioErr: any) {
                console.warn("Media devices access denied or unavailable:", audioErr?.message || audioErr);
                return null;
            }
        }
    }, []);

    const stopLocalStream = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
            setLocalStream(null);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        // Create new Peer instance with Google STUN servers for reliable WebRTC connectivity
        const newPeer = new Peer({
            config: {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                    { urls: "stun:stun2.l.google.com:19302" },
                ],
            },
        });

        peerRef.current = newPeer;
        setPeer(newPeer);

        newPeer.on("open", (id) => {
            console.log("PeerJS open with peerId:", id);
            setPeerId(id);

            if (socket) {
                socket.emit(EVENTS.USER_REGISTERED, { userId, peerId: id });
            }
        });

        newPeer.on("call", async (incomingCall) => {
            console.log("Incoming PeerJS call from:", incomingCall.peer);
            currentCallRef.current = incomingCall;

            let stream = localStreamRef.current;
            if (!stream) {
                stream = await startLocalStream();
            }

            if (stream) {
                incomingCall.answer(stream);
            } else {
                incomingCall.answer();
            }

            incomingCall.on("stream", (remoteMediaStream) => {
                console.log("Received remote stream on incoming call:", remoteMediaStream.id);
                setRemoteStream(remoteMediaStream);
            });

            incomingCall.on("close", () => {
                console.log("Incoming call closed");
                setRemoteStream(null);
            });

            incomingCall.on("error", (err) => {
                console.error("Incoming call error:", err);
            });
        });

        newPeer.on("error", (err) => {
            console.error("PeerJS error:", err);
        });

        return () => {
            newPeer.destroy();
            peerRef.current = null;
        };
    }, [userId, socket, startLocalStream]);

    const makeCall = useCallback(async (remotePeerId: string) => {
        const activePeer = peerRef.current;
        if (!activePeer || !remotePeerId) {
            console.warn("Cannot makeCall: peer or remotePeerId not ready", { activePeer, remotePeerId });
            return;
        }

        console.log("Initiating outgoing PeerJS call to remotePeerId:", remotePeerId);
        let stream = localStreamRef.current;
        if (!stream) {
            stream = await startLocalStream();
        }

        const outgoingCall = stream
            ? activePeer.call(remotePeerId, stream)
            : activePeer.call(remotePeerId, new MediaStream());

        if (!outgoingCall) {
            console.warn("peer.call failed to create MediaConnection");
            return;
        }

        currentCallRef.current = outgoingCall;

        outgoingCall.on("stream", (remoteMediaStream) => {
            console.log("Received remote stream on outgoing call:", remoteMediaStream.id);
            setRemoteStream(remoteMediaStream);
        });

        outgoingCall.on("close", () => {
            console.log("Outgoing call closed");
            setRemoteStream(null);
        });

        outgoingCall.on("error", (err) => {
            console.error("Outgoing call error:", err);
        });
    }, [startLocalStream]);

    const endCall = useCallback(() => {
        if (currentCallRef.current) {
            currentCallRef.current.close();
            currentCallRef.current = null;
        }
        setRemoteStream(null);
        stopLocalStream();
    }, [stopLocalStream]);

    return {
        peerId,
        localStream,
        remoteStream,
        makeCall,
        endCall,
        startLocalStream,
        stopLocalStream,
    };
};

