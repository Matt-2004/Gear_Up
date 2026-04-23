"use client";

import { addMessage } from "@/app/shared/utils/API/MessageAPI";
import { Image as ImageIcon, Send } from "lucide-react";
import { KeyboardEvent, useCallback, useRef, useState } from "react";

interface MessageInputProps {
  receiverId: string;
  onSendMessage?: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({
  receiverId,
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);

  const handleSend = useCallback(async () => {
    const text = message.trim();
    if (!text || disabled || sendingRef.current || !receiverId) return;

    try {
      sendingRef.current = true;
      setSending(true);
      await addMessage({ receiverId, text });
      onSendMessage?.(text);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }, [message, disabled, receiverId, onSendMessage]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    [],
  );

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-2">
        <input
          id="imageUpload"
          type="file"
          className="hidden"
          disabled={disabled}
        />
        <label
          className="shrink-0 cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          htmlFor="imageUpload"
        >
          <ImageIcon className="h-5 w-5" />
        </label>

        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled || sending || !receiverId}
          rows={1}
          className="max-h-32 flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
          style={{
            minHeight: "40px",
            maxHeight: "128px",
          }}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || sending || !receiverId}
          className="shrink-0 rounded-lg bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
