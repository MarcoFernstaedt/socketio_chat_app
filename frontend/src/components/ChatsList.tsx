import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

const ChatsList: React.FC = () => {
    const { onlineUsers } = useAuthStore();
    const {
        getChatPartners,
        chats,
        isUsersLoading,
        setSelectedUser,
    } = useChatStore();

    useEffect(() => {
        void getChatPartners();
    }, [getChatPartners]);

    if (isUsersLoading) return <UsersLoadingSkeleton />;
    if (chats.length === 0) return <NoChatsFound />;

    return (
        <>
            {chats.map((chat) => (
                <div
                    key={chat._id}
                    className="cursor-pointer rounded-lg bg-cyan-500/10 p-4 transition-colors hover:bg-cyan-500/20"
                    onClick={() => setSelectedUser(chat)}
                >
                    <div className="flex items-center gap-3">
                        <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
                            <div className="size-12 rounded-full overflow-hidden">
                                <img
                                    src={chat.profilePic || "/avatar.png"}
                                    alt={`${chat.fullname} avatar`}
                                    className="size-full object-cover"
                                />
                            </div>
                        </div>
                        <h4 className="truncate font-medium text-slate-200">
                            {chat.fullname}
                        </h4>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ChatsList;