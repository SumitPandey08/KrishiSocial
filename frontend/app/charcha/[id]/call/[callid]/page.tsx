'use client';

import { usePeer } from "@/hooks/usePeer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { EVENTS } from "@/utils/event.constants";

const CallPage = () => {
    const router = useRouter();
    const { id, callId } = router.query;
    const { socket, isConnected } = useSocket();
    const [remotePeerId, setRemotePeerId] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);

    const { peerId, localStream, remoteStream } = usePeer(id as string, socket!);

    useEffect(() => {
        if (socket && isConnected) {
            socket.emit(EVENTS.TOGGLE_PARTICIPATE, { callId, userId: id });
        }
    }, [socket, isConnected, callId, id]);

    useEffect(() => {
        if (socket) {
            socket.on(EVENTS.CALL_INITIATED, ({ remotePeerId }) => {
                setRemotePeerId(remotePeerId);
                setIsCallActive(true);
            });
        }
    }, [socket, isConnected]);

    return (
        <div>
            {isCallActive ? <p>Call is active with {remotePeerId}</p> : <p>Waiting for call...</p>}
        </div>
    );
};

export default CallPage;
