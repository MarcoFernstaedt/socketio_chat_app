import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

const ChatContainer: React.FC = () => {
    const { authUser } = useAuthStore();
    const {
        isMessagesLoading,
        selectedUser,
        getMessagesByUserId,
        messages,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatStore();

    const messageEndRef = useRef<HTMLDivElement | null>(null);

    // Load messages whenever the selected user changes
    useEffect(() => {
        if (!selectedUser) return;
        void getMessagesByUserId(selectedUser._id);

        subscribeToMessages()

        return () => {
            unsubscribeFromMessages()
        }
    }, [getMessagesByUserId, selectedUser, subscribeToMessages, unsubscribeFromMessages]);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const noChatSelected = !selectedUser;
    const hasMessages = messages.length > 0;

    return (
        <>
            <ChatHeader />

            <div className="flex-1 overflow-y-auto px-6 py-8">
                {/* LOADING */}
                {isMessagesLoading && <MessagesLoadingSkeleton />}

                {/* CHAT HISTORY */}
                {!isMessagesLoading && hasMessages && selectedUser && (
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
                                        {msg.image && (
                                            <img
                                                src={msg.image}
                                                alt="message attachment"
                                                className="h-48 rounded-lg object-cover"
                                            />
                                        )}

                                        {msg.text && <p className="mt-2">{msg.text}</p>}

                                        <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
                                            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={messageEndRef} />
                    </div>
                )}

                {/* EMPTY CHAT OR NO USER SELECTED */}
                {!isMessagesLoading && !hasMessages && selectedUser && (
                    <NoChatHistoryPlaceholder name={selectedUser.fullname} />
                )}

                {/* NO USER SELECTED */}
                {noChatSelected && !isMessagesLoading && (
                    <p className="text-center text-slate-400">Select a user to start chatting.</p>
                )}
            </div>

            <MessageInput />
        </>
    );
};

export default ChatContainer;