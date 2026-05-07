import Message from "../model/message.model.js";
import Chat from "../model/chat.model.js";

// Core logic for sending a message (reusable by Sockets)
export const sendMessageLogic = async ({ userId, chatId, content, messageType, mediaUrl }) => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error("Chat not found");
  if (!chat.participants.includes(userId)) throw new Error("Unauthorized");

  const message = new Message({
    sender: userId,
    content,
    chat: chatId,
    messageType: messageType || "text",
    mediaUrl,
  });

  await message.save();
  chat.latestMessage = message._id;
  await chat.save();

  return await message.populate("sender", "username name profilePicture");
};

// Express Controller
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, messageType, mediaUrl } = req.body;
    const message = await sendMessageLogic({
      userId: req.user.id,
      chatId,
      content,
      messageType,
      mediaUrl
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(error.message === "Unauthorized" ? 403 : 400).json({ message: error.message });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message || message.sender.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    message.content = content;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    
    if (!message || message.sender.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;
        await Message.updateMany(
            { chat: chatId, readBy: { $ne: req.user.id } },
            { $push: { readBy: req.user.id } }
        );
        res.json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
