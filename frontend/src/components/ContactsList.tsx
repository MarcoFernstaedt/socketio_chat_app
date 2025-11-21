import React, { useEffect } from "react";
import { useChatStore, type ChatUser } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ContactsList: React.FC = () => {
    const { onlineUsers } = useAuthStore();
    const {
        getAllContacts,
        allContacts,
        setSelectedUser,
        isUsersLoading,
    } = useChatStore();

    useEffect(() => {
        void getAllContacts();
    }, [getAllContacts]);

    if (isUsersLoading) <UsersLoadingSkeleton />;

    return (
        <>
            {allContacts.map((contact: ChatUser) => (
                <div
                    key={contact._id}
                    className="cursor-pointer rounded-lg bg-cyan-500/10 p-4 transition-colors hover:bg-cyan-500/20"
                    onClick={() => setSelectedUser(contact)}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"
                                }`}
                        >
                            <div className="size-12 overflow-hidden rounded-full">
                                <img
                                    src={contact.profilePic || "/avatar.png"}
                                    alt={`${contact.fullname} avatar`}
                                    className="size-full object-cover"
                                />
                            </div>
                        </div>

                        <h4 className="truncate font-medium text-slate-200">
                            {contact.fullname}
                        </h4>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ContactsList;
