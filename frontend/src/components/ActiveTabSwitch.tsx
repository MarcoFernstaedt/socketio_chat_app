import React from "react";
import { useChatStore, type ChatTab } from "../store/useChatStore";

const ActiveTabSwitch: React.FC = () => {
    const { activeTab, setActiveTab } = useChatStore();

    const handleSwitch = (tab: ChatTab) => {
        setActiveTab(tab);
    };

    return (
        <div className="tabs tabs-boxed bg-transparent p-2 m-2">
            <button
                onClick={() => handleSwitch("chats")}
                className={`tab ${activeTab === "chats"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400"
                    }`}
            >
                Chats
            </button>

            <button
                onClick={() => handleSwitch("contacts")}
                className={`tab ${activeTab === "contacts"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400"
                    }`}
            >
                Contacts
            </button>
        </div>
    );
};

export default ActiveTabSwitch;