import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

const ChatContainer: React.FC = () => {
    const { authUser } = useAuthStore();
    const { isMessagesLoading, selectedUser, getMessagesByUserId, messages } =
        useChatStore();

    useEffect(() => {
        if (!selectedUser) return;
        void getMessagesByUserId(selectedUser._id);
    }, [getMessagesByUserId, selectedUser]);

    return (
        <>
            <ChatHeader />
            <div className="flex-1 overflow-y-auto px-6 py-8">
                {isMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : messages.length > 0 && selectedUser ? (
                    <div className="mx-auto max-w-3xl space-y-6">
                        {messages.map((msg) => {
                            const isOwnMessage =
                                authUser != null && msg.senderId === authUser._id;

                            return (
                                <div
                                    key={msg._id}
                                    className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
                                >
                                    <div
                                        className={`chat-bubble relative ${isOwnMessage
                                                ? "bg-cyan-600 text-black"
                                                : "bg-slate-800 text-slate-200"
                                            }`}
                                    >
                                        {"image" in msg && msg.image ? (
                                            <img
                                                src={msg.image}
                                                alt="message attachment"
                                                className="h-48 rounded-lg object-cover"
                                            />
                                        ) : null}

                                        {"text" in msg && msg.text ? (
                                            <p className="mt-2">{msg.text}</p>
                                        ) : null}

                                        <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
                                            {new Date(msg.createdAt).toISOString().slice(11, 16)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : isMessagesLoading ? (
                    <MessagesLoadingSkeleton />
                ) : (
                    <NoChatHistoryPlaceholder name={selectedUser?.fullname} />
                )}
            </div>
            <MessageInput />
        </>
    );
};

export default ChatContainer;
