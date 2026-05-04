"use client";

import {
  addComment,
  addLikeToComment,
} from "@/app/shared/utils/API/CommentAPI";
import { formatRelativeTime } from "@/app/shared/utils/timeFormat";
import { addUserPostLikes } from "@/app/shared/utils/API/PostAPI";
import clsx from "clsx";
import { Heart, Reply } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { ICommentProps, useCommentContext } from "../context/CommentContext";
import { AddCommentDTO } from "../types/comment.dto";
import { CommentModel } from "../types/comment.model";

interface ICommnetsProps {
  comment: ICommentProps[];
  level: number;
}

export const Comment = ({ comment, level }: ICommnetsProps) => {
  const { handleParentIdUpdate, expandedCommentIds, toggleExpandedCommentId } =
    useCommentContext();

  const contentRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState<string>("");

  // get the id of the comment to show reply box
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleReplySubmit = async ({
    postId,
    text,
    parentCommentId,
  }: AddCommentDTO) => {
    try {
      await addComment({ postId, text, parentCommentId });
    } catch (err) {
      console.error("Error in creating comment:: ", err);
    }
  };

  const handleActiveReply = (id: string | null) => {
    setActiveReplyId(id);
    setReplyText("");
  };

  // level: 0 => comment level 1, 1 => level 2, 2 => level 3 (stop)
  const canExpandMore = level < 2;

  const handleToggleShowReplies = (c: ICommentProps) => {
    if (!canExpandMore) return;
    const id = String(c.id);
    const willExpand = !expandedCommentIds.includes(id);
    toggleExpandedCommentId(id);

    // trigger fetch only when expanding and replies aren't loaded yet
    if (willExpand && (!c.replies || c.replies.length === 0)) {
      handleParentIdUpdate(id);
    }
  };

  return (
    <div
      className={clsx(level > 0 ? "pl-12" : "pl-6", "relative mt-2 space-y-4")}
    >
      {/* vertical guide for this nested block (only visible for nested levels) */}
      {level > 0 && (
        <div
          className={clsx(
            "absolute -top-4 bottom-0 left-4 h-[calc(100%-4.8rem)] w-px bg-gray-300",
          )}
          aria-hidden
        />
      )}

      {comment.map((c, i) => (
        <div key={i} className="relative">
          {/* connector from vertical guide to this comment */}

          {level > 0 && (
            <div
              className={`absolute -top-2 -left-8 h-10 w-7 rounded-bl-xl border-b border-l border-gray-300 bg-white`}
              aria-hidden
            />
          )}

          <div className="w-full">
            <div className="flex w-full gap-4">
              <Image
                src={c.commentedUserProfilePictureUrl}
                alt={c.commentedUserName}
                width={60}
                height={40}
                className="mt-2 h-10 w-10 rounded-full"
              />
              <div className="flex w-full flex-col">
                {/* Comment Content */}
                <div>
                  <div className="rounded-lg">
                    <h1 className="text-sm">{c.commentedUserName}</h1>
                    <p ref={contentRef} className="text-sm">
                      {c.content}
                    </p>
                  </div>
                  {/* Timeline */}
                  <div className="mb-2">
                    <h3 className="text-xs font-light">
                      {formatRelativeTime(c.createdAt).value}{" "}
                      {formatRelativeTime(c.createdAt).unit} ago
                    </h3>
                  </div>
                  {/* c Actions */}
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center">
                      <LikeCount
                        type="comment"
                        id={c.id}
                        isLikedByCurrentUser={c.isLikedByCurrentUser}
                        likeCount={c.likeCount}
                      />
                      {level < 2 && (
                        <ReplyBtn
                          handleActiveReply={handleActiveReply}
                          comment={c}
                        />
                      )}
                    </div>
                  </div>
                  {/* Reply text box and submit button (render only for this c) */}
                  {activeReplyId === String(c.id || i) && (
                    <div className="mt-2 w-full">
                      <CommentTextBox
                        value={replyText}
                        onChange={setReplyText}
                        onSubmit={() =>
                          handleReplySubmit({
                            postId: c.postId,
                            text: replyText,
                            parentCommentId: c.id,
                          })
                        }
                        onCancel={() => setActiveReplyId(null)}
                      />
                    </div>
                  )}
                </div>
                {canExpandMore &&
                  c.childCount > 0 &&
                  !expandedCommentIds.includes(String(c.id)) && (
                    <>
                      <div
                        className="absolute top-14 bottom-0 left-4 h-[calc(100%-4.9rem)] w-px bg-gray-300"
                        aria-hidden
                      />
                      <div
                        className="absolute top-[calc(100%-1.4rem)] left-4 h-4 w-7 rounded-bl-full border-b border-l border-gray-300"
                        aria-hidden
                      />
                      <button
                        onClick={() => handleToggleShowReplies(c)}
                        className="mt-3 cursor-pointer text-start text-xs text-gray-600 hover:underline"
                      >
                        Show {c.childCount} replies
                      </button>
                    </>
                  )}
              </div>
            </div>

            {expandedCommentIds.includes(String(c.id)) && c.replies && (
              <Comment comment={c.replies} level={level + 1} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const CommentTextBox = ({
  value,
  onChange,
  onSubmit,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputAutoSize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onInput={handleInputAutoSize}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add a comment..."
        className="focus:border-primary w-full rounded-md border border-gray-400 p-2 text-sm focus:outline-none"
        rows={1}
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="cursor-pointer rounded border px-3 py-1 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="bg-primary active:bg-primary-dark cursor-pointer rounded px-5 py-1 text-white"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export const ReplyBtn = ({
  handleActiveReply,
  comment,
}: {
  handleActiveReply: (id: string) => void;
  comment: CommentModel;
}) => {
  return (
    <button
      className="flex cursor-pointer items-center gap-1 rounded-md px-2 text-gray-600"
      onClick={() => handleActiveReply(String(comment.id))}
    >
      <Reply className="h-4 w-4 -scale-x-100 font-normal" />
      <h3 className="text-xs font-light hover:font-medium">Reply</h3>
    </button>
  );
};

export const LikeCount = ({
  type,
  id,
  isLikedByCurrentUser,
  likeCount,
}: {
  type: "comment" | "post";
  id: string;
  isLikedByCurrentUser: boolean;
  likeCount: number;
}) => {
  const [liked, setLiked] = useState<boolean>(isLikedByCurrentUser);
  const [count, setCount] = useState<number>(likeCount);

  const handelSubmit = async (type: string, id: string) => {
    setCount((prev) => prev + (liked ? -1 : 1));
    setLiked((prev) => !prev);
    if (type === "comment") {
      await addLikeToComment(id);
    } else {
      await addUserPostLikes(id);
    }
  };
  return (
    <button
      onClick={() => handelSubmit(type, id)}
      className="hover:bg-primary-50 hover:text-primary-600 flex cursor-pointer items-center gap-1 rounded-lg px-3 text-gray-600 transition-all duration-200"
    >
      {/* TODO: if isLikedByCurrentUser is true, change the heart icon to a filled heart */}
      <span className="flex h-5 w-5 items-center justify-center">
        <Heart
          className={`w-6 h-6 transition ${
            liked ? "fill-red-500 text-red-500" : "fill-none text-gray-400"
          }`}
        />
      </span>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
};
