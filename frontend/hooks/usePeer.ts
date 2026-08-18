import Peer, { MediaConnection } from "peerjs";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { EVENTS } from "@/utils/event.constants";

export const usePeer = (userId: string, socket: Socket | null) => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [peerId, setPeerId] = useState('');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const currentCallRef = useRef<MediaConnection | null>(null);

    useEffect(() => {
        async function initMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        }
        initMedia();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (!userId) return;

        // Create new Peer instance
        const newPeer = new Peer();

        newPeer.on('open', (id) => {
            setPeerId(id);
            setPeer(newPeer);

            // Register Peer ID with your Socket.io backend controller
            if (socket) {
                socket.emit(EVENTS.USER_REGISTERED, { userId, peerId: id });
            }
        });

        return () => {
            newPeer.destroy();
        };
    }, [userId, socket]);

    //Listen for incoming calls
    useEffect(() => {
        if (!peer || !localStream) return;

        peer.on('call', (call) => {
            call.answer(localStream);
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            });
        });
    }, [peer, localStream]);

    const makeCall = (remotePeerId: string) => {
        if (!peer || !localStream) return;

        const call = peer.call(remotePeerId, localStream);
        currentCallRef.current = call;

        call.on('stream', (stream) => {
            setRemoteStream(stream);
        });

        call.on('close', () => {
            setRemoteStream(null);
        });
    };

    const endCall = () => {
        if (currentCallRef.current) {
            currentCallRef.current.close();
            setRemoteStream(null);
        }
        setRemoteStream(null);
    };


    return { peerId, localStream, remoteStream, makeCall, endCall };



};
