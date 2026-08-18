import Call from "../model/callModel.js";
import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";

export const callLogic = async (initiaterId, chatId, callType) => {
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

    const newCall = new Call({
        callType,
        initiator: initiatorId,
        participants: chat.participants.map((participant) => participant._id),
        callStatus: "initiated",
        chatId,
        startedAt: new Date(),
    });

    const savedCall = await newCall.save();

    const callMessage = new Message({
        sender: initiatorId,
        content: `${initiator.name} initiated a ${callType} call.`,
        chat: chatId,
        messageType: "call",
        mediaUrl: null,
    });

    await callMessage.save();
    chat.latestMessage = callMessage._id;
    await chat.save();

    return {
        call: savedCall,
        chatId: chat._id.toString(),
        receiverId: receiver._id.toString(),
    };
};

export const initiateCall = async (req, res) => {
    try {
        const { initiaterId, chatId, callType } = req.body;
        const result = await callLogic(initiaterId, chatId, callType);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error initiating call:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const toggleParticipateLogic = async (callId, userId, action) => {
    const call = await Call.findById(callId);
    if (!call) {
        throw new Error("Call not found");
    }

    if (!call.participants.some((participantId) => participantId.toString() === userId)) {
        throw new Error("User is not a participant of this call");
    }

    if (action === "accept") {
        call.callStatus = "accepted";
    } else if (action === "decline") {
        call.callStatus = "rejected";
    } else if (action === "end") {
        call.callStatus = "ended";
    } else {
        throw new Error("Invalid action");
    }

    await call.save();

    return {
        call,
        chatId: call.chatId.toString(),
    };
};

export const toggleParticipate = async (req, res) => {
    try {
        //accept, decline, end
        const { callId, userId, action } = req.body;
        const result = await toggleParticipateLogic(callId, userId, action);
        res.json(result);
    } catch (error) {
        console.error("Error toggling call participation:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getCallHistory = async (req, res) => {
    try {
        const { userId } = req.params;

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

