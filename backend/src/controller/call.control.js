import Call from "../model/callModel.js";
import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";

export const getActiveCallForUser = async (userId) => {
    if (!userId) return null;
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    return await Call.findOne({
        participants: userId,
        $or: [
            { callStatus: "accepted" },
            { callStatus: { $in: ["initiated", "ringing"] }, updatedAt: { $gte: tenMinutesAgo } },
        ],
    })
    .populate("initiator", "name email")
    .populate("participants", "name email")
    .sort({ createdAt: -1 });
};

export const callLogic = async (initiatorIdInput, chatId, callType = "audio") => {
    const initiatorId = initiatorIdInput?.toString();
    const chat = await Chat.findById(chatId).populate("participants", "name email chatType");

    if (!chat) {
        throw new Error("Chat not found");
    }

    const initiator = chat.participants.find((participant) => participant._id.toString() === initiatorId);
    if (!initiator) {
        throw new Error("Initiator is not a participant of this chat");
    }

    const receiver = chat.participants.find((participant) => participant._id.toString() !== initiatorId);
    if (!receiver) {
        throw new Error("No other participant found in the chat");
    }

    // 1. Check if initiator is already in an active call
    const initiatorActiveCall = await getActiveCallForUser(initiatorId);
    if (initiatorActiveCall) {
        return {
            isBusy: true,
            reason: "initiator_busy",
            message: "You are already in an active call.",
            callId: initiatorActiveCall._id.toString(),
            chatId: initiatorActiveCall.chatId.toString(),
            activeCall: initiatorActiveCall,
        };
    }

    // 2. Check if receiver is already in an active call
    const receiverActiveCall = await getActiveCallForUser(receiver._id);
    if (receiverActiveCall) {
        const busyCall = new Call({
            callType: callType || "audio",
            initiator: initiatorId,
            participants: [initiatorId, receiver._id],
            callStatus: "busy",
            chatId,
            startedAt: new Date(),
            endedAt: new Date(),
            duration: 0,
        });
        const savedBusyCall = await busyCall.save();

        const callMessage = new Message({
            sender: initiatorId,
            content: `Missed ${callType} call. ${receiver.name || 'User'} is busy on another call.`,
            chat: chatId,
            messageType: "call",
            mediaUrl: "",
        });
        await callMessage.save();
        chat.latestMessage = callMessage._id;
        await chat.save();

        return {
            isBusy: true,
            reason: "receiver_busy",
            message: `${receiver.name || 'User'} is busy on another call.`,
            call: savedBusyCall,
            callId: savedBusyCall._id.toString(),
            chatId: chat._id.toString(),
            receiverId: receiver._id.toString(),
        };
    }

    // 3. Initiate new call
    const newCall = new Call({
        callType: callType || "audio",
        initiator: initiatorId,
        participants: chat.participants.map((participant) => participant._id),
        callStatus: "initiated",
        chatId,
        startedAt: new Date(),
    });

    const savedCall = await newCall.save();

    const callMessage = new Message({
        sender: initiatorId,
        content: `${initiator.name || 'User'} initiated a ${callType} call.`,
        chat: chatId,
        messageType: "call",
        mediaUrl: "",
    });

    await callMessage.save();
    chat.latestMessage = callMessage._id;
    await chat.save();

    return {
        isBusy: false,
        call: savedCall,
        callId: savedCall._id.toString(),
        chatId: chat._id.toString(),
        receiverId: receiver._id.toString(),
    };
};

export const initiateCall = async (req, res) => {
    try {
        const initiatorId = req.body.initiatorId || req.body.initiaterId || req.user?._id;
        const { chatId, callType } = req.body;
        const result = await callLogic(initiatorId, chatId, callType);
        
        if (result.isBusy) {
            return res.status(200).json(result);
        }
        res.status(201).json(result);
    } catch (error) {
        console.error("Error initiating call:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getUserActiveCall = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?._id;
        const activeCall = await getActiveCallForUser(userId);
        res.json({ activeCall, isBusy: !!activeCall });
    } catch (error) {
        console.error("Error fetching active call:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleParticipateLogic = async (callId, userIdInput, action) => {
    const call = await Call.findById(callId);
    if (!call) {
        throw new Error("Call not found");
    }

    const userId = userIdInput?.toString();
    if (userId && !call.participants.some((participantId) => participantId.toString() === userId)) {
        throw new Error("User is not a participant of this call");
    }

    if (action === "accept") {
        call.callStatus = "accepted";
    } else if (action === "decline" || action === "reject") {
        call.callStatus = "rejected";
    } else if (action === "end") {
        call.callStatus = "ended";
    } else {
        throw new Error("Invalid action");
    }

    await call.save();

    return {
        call,
        callId: call._id.toString(),
        chatId: call.chatId.toString(),
        action,
    };
};

export const toggleParticipate = async (req, res) => {
    try {
        //accept, decline, reject, end
        const userId = req.body.userId || req.user?._id;
        const { callId, action } = req.body;
        const result = await toggleParticipateLogic(callId, userId, action);
        res.json(result);
    } catch (error) {
        console.error("Error toggling call participation:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getCallHistory = async (req, res) => {
    try {
        const userId = req.params.userId || req.params.chatId || req.user?._id;

        const calls = await Call.find({ participants: userId })
            .populate("initiator", "name email")
            .populate("participants", "name email")
            .populate("chatId", "chatType")
            .sort({ startedAt: -1 });

        res.json(calls);
    } catch (error) {
        console.error("Error fetching call history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCallDetails = async (req, res) => {
    try {
        const { callId } = req.params;

        const call = await Call.findById(callId)
            .populate("initiator", "name email")
            .populate("participants", "name email")
            .populate("chatId", "chatType");

        if (!call) {
            return res.status(404).json({ message: "Call not found" });
        }

        res.json(call);
    } catch (error) {
        console.error("Error fetching call details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};   

