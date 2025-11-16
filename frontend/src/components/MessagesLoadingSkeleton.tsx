import React from "react";

const MessagesLoadingSkeleton: React.FC = () => {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"
                        } animate-pulse`}
                >
                    <div className="chat-bubble w-32 bg-slate-800 text-white"></div>
                </div>
            ))}
        </div>
    );
};

export default MessagesLoadingSkeleton;
