import React from "react";
import { MessageCircleIcon } from "lucide-react";

type NoChatHistoryPlaceholderProps = {
    name?: string;
};

const NoChatHistoryPlaceholder: React.FC<NoChatHistoryPlaceholderProps> = ({
    name,
}) => {
    const displayName = name ?? "this contact";

    return (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-400/10">
                <MessageCircleIcon className="size-8 text-cyan-400" />
            </div>

            <h3 className="mb-3 text-lg font-medium text-slate-200">
                Start your conversation with {displayName}
            </h3>

            <div className="mb-5 flex max-w-md flex-col space-y-3">
                <p className="text-sm text-slate-400">
                    This is the beginning of your conversation. Send a message to start
                    chatting.
                </p>
                <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                <button
                    type="button"
                    className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
                >
                    👋 Say hello
                </button>
                <button
                    type="button"
                    className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
                >
                    🤝 How are you?
                </button>
                <button
                    type="button"
                    className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
                >
                    📅 Meet up soon?
                </button>
            </div>
        </div>
    );
};

export default NoChatHistoryPlaceholder;