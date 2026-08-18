'use client';

import { usePeer } from "@/hooks/usePeer";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { EVENTS } from "@/utils/event.constants";

const CallPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const callId = (params?.callid || params?.callId) as string;
    const { socket, isConnected } = useSocket();
    const [remotePeerId, setRemotePeerId] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);

    const { peerId, localStream, remoteStream } = usePeer(id, socket);

    useEffect(() => {
        if (socket && isConnected && callId && id) {
            socket.emit(EVENTS.TOGGLE_PARTICIPATE, { callId, userId: id });
        }
    }, [socket, isConnected, callId, id]);

    useEffect(() => {
        if (socket) {
            const handleCallInitiated = ({ remotePeerId }: { remotePeerId: string }) => {
                setRemotePeerId(remotePeerId);
                setIsCallActive(true);
            };

            socket.on(EVENTS.CALL_INITIATED, handleCallInitiated);

            return () => {
                socket.off(EVENTS.CALL_INITIATED, handleCallInitiated);
            };
        }
    }, [socket, isConnected]);

    return (
        <div>
            {isCallActive ? <p>Call is active with {remotePeerId}</p> : <p>Waiting for call...</p>}
        </div>
    );
};

export default CallPage;
