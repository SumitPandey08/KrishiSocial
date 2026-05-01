import { toggleLike } from "../controller/post.control.js";
import { EVENTS } from "../utils/event.constants.js";

export default function registerPostHandlers(io, socket) {
  socket.on(EVENTS.JOIN_POST, ({ postId }) => {
    socket.join(postId);
    console.log(`User ${socket.user?.id || 'anon'} joined post room ${postId}`);
  });

  socket.on(EVENTS.LEAVE_POST, ({ postId }) => {
    socket.leave(postId);
    console.log(`User ${socket.user?.id || 'anon'} left post room ${postId}`);
  });

  socket.on(EVENTS.LIKE_POST, async ({ postId }) => {
    if (!socket.user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const result = await toggleLike(socket.user.id, postId);
      // Emitting likesCount is recommended so all clients can update the total count
      io.to(postId).emit(EVENTS.POST_LIKED, { postId, userId: socket.user.id, liked: result.liked, likesCount: result.likesCount });
      console.log(`User ${socket.user.id} toggled like on post ${postId}. Liked: ${result.liked}`); 
    } catch (error) {
      console.error("Error toggling like:", error);
      socket.emit("error", { message: "Failed to toggle like", postId });
    }
  });
}
