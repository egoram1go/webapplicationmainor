import React from "react";
import { format } from "date-fns";
import { useTasks } from "../../context/TasksContext";
import { UserCircle, Send, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface CommentListProps {
  taskId: number;
}

const CommentList: React.FC<CommentListProps> = ({ taskId }) => {
  const { user } = useAuth();
  const { getTaskById, addComment, updateComment, deleteComment } = useTasks();
  const task = getTaskById(taskId);
  const comments = task?.comments || [];

  const AddComment = () => {
    const [content, setContent] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
      if (!content.trim()) return;
      setIsLoading(true);
      try {
        await addComment({
          taskId,
          content
        });
        setContent("");
      } catch (error) {
        console.error("Failed to add comment:", error);
        toast.error("Failed to add comment");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="flex items-center gap-2 mt-4">
        <UserCircle className="h-8 w-8 text-gray-400" />
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !content.trim()}
          size="sm"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Posting...
            </span>
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              Post
            </>
          )}
        </Button>
      </div>
    );
  };

  const EditCommentDialog = ({
    comment,
    onClose,
  }: {
    comment: Comment;
    onClose: () => void;
  }) => {
    const [content, setContent] = React.useState(comment.content);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        await updateComment({ id: comment.id, content });
        onClose();
      } catch (error) {
        console.error("Failed to update comment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <Label htmlFor="content">Comment</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                  Updating...
                </span>
              ) : (
                "Update Comment"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const CommentItem = ({ comment }: { comment: Comment }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const isCurrentUserComment = comment.userId === user?.id;

    const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this comment?")) {
        try {
          await deleteComment(comment.id);
        } catch (error) {
          console.error("Failed to delete comment:", error);
        }
      }
    };

    const formattedDate =
      comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
        ? format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")
        : null;

    return (
      <div className="py-3 border-b last:border-b-0">
        {isEditing ? (
          <EditCommentDialog
            comment={comment}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex gap-3">
            <UserCircle className="h-8 w-8 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {comment.username?.trim() || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
                {isCurrentUserComment && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formattedDate || "Loading date..."}
                {comment.updatedAt !== comment.createdAt && " (edited)"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </h3>
      <div className="space-y-3 mb-4">
        {comments.length > 0 ? (
          comments
            .slice()
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
      <AddComment />
    </div>
  );
};

export default CommentList;
