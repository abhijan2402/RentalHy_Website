import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Spin, Input, Button, Avatar } from "antd";
import {
  useGetchatListQuery,
  useMarkAsReadToChatMutation,
  useReplyTochatMutation,
} from "../redux/api/chatApi";

import { ArrowLeftOutlined } from "@ant-design/icons";

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const chatBoxRef = useRef(null);

  const { data, isLoading, isError, refetch } = useGetchatListQuery(id);
  const [replyToChat, { isLoading: isSending, error }] =
    useReplyTochatMutation();
  const [markAsRead] = useMarkAsReadToChatMutation();

  const [message, setMessage] = useState("");

  console.log(error);

  // Auto scroll to bottom when new messages come
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [data]);

  // Mark chat as read when mounted
  useEffect(() => {
    if (id && user?.id) {
      const formData = new FormData();
      formData.append("senders_id", id);
      markAsRead(formData);
    }
  }, [id, user?.id]);

  // Send message
  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("recevier_id", id);
      await replyToChat(formData).unwrap();
      setMessage("");
      refetch();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Loading & error handling
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spin tip="Loading chat..." size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[90vh] text-red-500 font-medium">
        ❌ Error loading chat. Please try again later.
      </div>
    );
  }

  const messages = data?.data || [];

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto mt-28 mb-10 border rounded-2xl shadow-lg overflow-hidden bg-white">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 bg-[#7C0902] text-white p-4 text-lg font-semibold flex items-center gap-3 shadow-md">
        <ArrowLeftOutlined
          onClick={() => navigate(-1)}
          className="text-white text-xl cursor-pointer hover:text-gray-300 transition"
        />
        {/* <Avatar
          src={messages[0]?.receiver?.image}
          alt="receiver"
          size="large"
        /> */}
        {/* <span>{messages[0]?.receiver?.name || `User #${id}`}</span> */}
        <span>Chat</span>
      </div>

      {/* Chat Body */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            No messages yet.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSender = msg.sender_id === user?.id;
            const profileImg = isSender
              ? msg.sender?.image
              : msg.receiver?.image;

            return (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {/* {!isSender && (
                  <Avatar src={profileImg} size="small" className="shadow-sm" />
                )} */}

                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] break-words shadow-sm ${
                    isSender
                      ? "bg-[#7C0902] text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  {msg.message}
                  <div
                    className={`text-[10px] mt-1 opacity-70 ${
                      isSender ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {/* {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} */}
                  </div>
                </div>

                {isSender && (
                  <Avatar src={profileImg} size="small" className="shadow-sm" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white border-t p-3 flex gap-2 items-center">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onPressEnter={handleSend}
          className="rounded-full px-4 py-2"
        />
        <Button
          type="primary"
          shape="round"
          onClick={handleSend}
          loading={isSending}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
