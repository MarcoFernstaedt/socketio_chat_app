import React from "react";
import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder: React.FC = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-cyan-500/20">
                <MessageCircleIcon className="size-10 text-cyan-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-slate-200">
                Select a conversation
            </h3>

            <p className="max-w-md text-slate-400">
                Choose a contact from the sidebar to start chatting or continue a
                previous conversation.
            </p>
        </div>
    );
};

export default NoConversationPlaceholder;