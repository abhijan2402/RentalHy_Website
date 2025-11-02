import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Spin, Input, Button, Avatar, List, Badge } from "antd";
import {
  useGetchatAllListQuery,
  useGetchatListQuery,
  useMarkAsReadToChatMutation,
  useReplyTochatMutation,
} from "../redux/api/chatApi";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ChatList = () => {
  const { user } = useAuth();
  const chatBoxRef = useRef(null);

  // 🔹 States
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  // 🔹 API Hooks
  const {
    data: chatListData,
    isLoading: listLoading,
    isError: listError,
  } = useGetchatAllListQuery();
  const {
    data: chatData,
    isLoading: chatLoading,
    isError: chatError,
    refetch,
  } = useGetchatListQuery(selectedUser?.user_id, { skip: !selectedUser });

  const [replyToChat, { isLoading: isSending }] = useReplyTochatMutation();
  const [markAsRead] = useMarkAsReadToChatMutation();

  const chatList = chatListData?.data || [];
  const messages = chatData?.data || [];

  // 🔹 Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔹 Mark chat as read
  useEffect(() => {
    if (selectedUser?.user_id && user?.id) {
      const formData = new FormData();
      formData.append("senders_id", selectedUser.user_id);
      markAsRead(formData);
    }
  }, [selectedUser, user?.id]);

  // 🔹 Handle sending message
  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;
    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("recevier_id", selectedUser.user_id);
      await replyToChat(formData).unwrap();
      setMessage("");
      refetch();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // 🔹 Loading & Error handling
  if (listLoading) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spin tip="Loading chats..." size="large" />
      </div>
    );
  }

  if (listError) {
    return (
      <div className="flex items-center justify-center h-[90vh] text-red-500 font-medium">
        ❌ Error loading chat list. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[80vh] max-w-5xl mx-auto mt-0 mb-10 border rounded-2xl shadow-lg overflow-hidden bg-white">
      {/* LEFT PANEL — Chat List */}
      <div className="w-full md:w-1/3 border-r bg-gray-50 overflow-y-auto">
        <div className="sticky top-0 bg-[#7C0902] text-white text-lg font-semibold p-4">
          Chat List
        </div>

        {chatList.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No chats found.</div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={chatList}
            renderItem={(chat) => (
              <List.Item
                className={`cursor-pointer px-4 py-3 transition-all ${
                  selectedUser?.user_id === chat.user_id
                    ? "bg-[#ffe8e7]"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedUser(chat)}
              >
                <List.Item.Meta
                  // avatar={
                  //   <Badge dot={!chat.is_read} color="#7C0902">
                  //     <Avatar
                  //       src={chat.user_image || "/default-user.png"}
                  //       alt={chat.user_name}
                  //     />
                  //   </Badge>
                  // }
                  title={
                    <div className="flex px-2 justify-between items-center">
                      <span className="font-semibold">{chat.user_name}</span>
                      <span className="text-xs px-2 text-gray-400">
                        {chat.last_message_at}
                      </span>
                    </div>
                  }
                  description={
                    <span
                      className={`text-sm px-2 truncate block ${
                        chat.is_read
                          ? "text-gray-500"
                          : "text-black font-medium"
                      }`}
                    >
                      {chat.last_message}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* RIGHT PANEL — Chat Box */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            👈 Select a chat to start messaging
          </div>
        ) : chatLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spin tip="Loading chat..." />
          </div>
        ) : chatError ? (
          <div className="flex items-center justify-center h-full text-red-500 font-medium">
            ❌ Error loading chat. Please try again.
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-[#7C0902] text-white p-4 text-lg font-semibold flex items-center gap-3 shadow-md">
              <ArrowLeftOutlined
                onClick={() => setSelectedUser(null)}
                className="text-white text-xl cursor-pointer hover:text-gray-300 transition md:hidden"
              />
              {/* <Avatar
                src={selectedUser.user_image || "/default-user.png"}
                size="large"
              /> */}
              <span>{selectedUser.user_name}</span>
            </div>

            {/* Messages */}
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
                        <Avatar
                          src={profileImg}
                          size="small"
                          className="shadow-sm"
                        />
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
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      {isSender && (
                        <Avatar
                          src={profileImg}
                          size="small"
                          className="shadow-sm"
                        />
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
          </>
        )}
      </div>
    </div>
  );
};

export default ChatList;
