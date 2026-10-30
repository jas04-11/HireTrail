import { useState } from "react";
import { Trash2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { experienceApi } from "../../api/experienceApi";
import { useAuth } from "../../context/AuthContext";
import { formatDistanceToNow } from "../../utils/formatDate";
import { Spinner } from "../common/Loader";

const CommentSection = ({ experienceId, comments, onCommentsChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await experienceApi.addComment(experienceId, text.trim());
      onCommentsChange(data.comments);
      setText("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await experienceApi.deleteComment(experienceId, commentId);
      onCommentsChange(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete comment");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Discussion ({comments.length})</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask a question about this interview..."
            className="input-field text-sm"
          />
          <button type="submit" disabled={submitting || !text.trim()} className="btn-primary !px-3.5">
            {submitting ? <Spinner size={15} /> : <Send size={15} />}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-gray-500">
          <a href="/login" className="text-primary-600 hover:underline">Log in</a> to join the discussion.
        </p>
      )}

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">No comments yet. Be the first to ask something.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="border border-gray-100 rounded-md px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-900">{c.user?.name || "Deleted user"}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{formatDistanceToNow(c.createdAt)}</span>
                  {user?._id === c.user?._id && (
                    <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-600">{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
