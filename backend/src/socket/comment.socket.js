import { commentOnPost } from "../controller/post.control.js";
import { deleteComment } from "../controller/post.control.js";
import { EVENTS } from "../utils/event.constants.js";

export default function registerCommentHandlers(io, socket) {
  socket.on(EVENTS.ADD_COMMENT, async ({ postId, content }) => {
    try {
      const comment = await commentOnPost(socket.user.id, postId, content);
      io.to(postId).emit(EVENTS.NEW_COMMENT, { postId, comment });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });
  socket.on(EVENTS.DELETE_COMMENT, async ({ commentId }) => {
    try {
      const comment = await deleteComment(socket.user.id, commentId);
      io.to(comment.post).emit(EVENTS.COMMENT_DELETED, { commentId });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  });
}