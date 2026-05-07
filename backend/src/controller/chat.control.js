import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";

export const createChat = async (req, res) => {
  try {
    const { chatName, isGroupChat, chatType, participants, communityId } = req.body;

    if (chatType === "community") {
      if (!communityId) {
        return res.status(400).json({ message: "Community ID is required for community chats." });
      }
      // Check if community chat already exists
      let existingChat = await Chat.findOne({
        chatType: "community",
        communityId: communityId,
      });
      if (existingChat) {
        // Ensure current user is in participants
        if (!existingChat.participants.includes(req.user.id)) {
          existingChat.participants.push(req.user.id);
          await existingChat.save();
        }
        return res.status(200).json(existingChat);
      }
    }


    if (chatType === "personal") {
      if (!participants || participants.length !== 1) {
        return res.status(400).json({ message: "Personal chat requires exactly one participant (besides yourself)." });
      }
      // Check if personal chat already exists
      const existingChat = await Chat.findOne({
        chatType: "personal",
        participants: { $all: [req.user.id, participants[0]] },
      });
      if (existingChat) {
        return res.status(200).json(existingChat);
      }
    }

    if ((isGroupChat || chatType === "group") && (!participants || participants.length < 2)) {
      return res.status(400).json({ message: "Group chats require at least 2 participants." });
    }

    const chat = new Chat({
      chatName,
      isGroupChat: chatType !== "personal",
      chatType,
      participants: [...participants, req.user.id],
      communityId: chatType === "community" ? communityId : undefined,
      groupAdmin: chatType !== "personal" ? req.user.id : undefined,
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "username name profilePicture")
      .populate("latestMessage")
      .populate("groupAdmin", "username name")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addParticipant = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.chatType === "personal") {
      return res.status(400).json({ message: "Cannot add participants to a personal chat" });
    }

    // Only admin can add
    if (chat.groupAdmin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the group admin can add participants" });
    }

    if (chat.participants.includes(userId)) {
      return res.status(400).json({ message: "User is already a participant" });
    }

    chat.participants.push(userId);
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeParticipant = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.chatType === "personal") {
      return res.status(400).json({ message: "Cannot remove participants from a personal chat" });
    }

    // Only admin can remove
    if (chat.groupAdmin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the group admin can remove participants" });
    }

    if (!chat.participants.includes(userId)) {
      return res.status(400).json({ message: "User is not a participant" });
    }

    chat.participants = chat.participants.filter(
      (participant) => participant.toString() !== userId
    );
    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error("Error removing participant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.chatType !== "personal" && chat.groupAdmin?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the chat creator can delete the chat" });
    }

    if (chat.chatType === "personal" && !chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "You are not a participant of this chat" });
    }

    await Message.deleteMany({ chat: chatId });
    await Chat.findByIdAndDelete(chatId);
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50, sortBy = "createdAt", order = "desc" } = req.query;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "You are not a participant of this chat" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username name profilePicture")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const exitChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (chat.chatType === "personal") {
      return res.status(400).json({ message: "Cannot exit a personal chat" });
    }
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "You are not a participant of this chat" });
    }

    chat.participants = chat.participants.filter(
      (participant) => participant.toString() !== req.user.id
    );

    // If admin exits, assign new admin if possible
    if (chat.groupAdmin && chat.groupAdmin.toString() === req.user.id && chat.participants.length > 0) {
      chat.groupAdmin = chat.participants[0];
    }

    await chat.save();
    res.json({ message: "Exited chat successfully" });
  } catch (error) {
    console.error("Error exiting chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
