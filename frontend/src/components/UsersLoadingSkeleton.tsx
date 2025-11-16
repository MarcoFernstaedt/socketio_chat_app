import React from "react";

const UsersLoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-2">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="animate-pulse rounded-lg bg-slate-800/30 p-4"
                >
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-slate-700"></div>

                        <div className="flex-1">
                            <div className="mb-2 h-4 w-3/4 rounded bg-slate-700"></div>
                            <div className="h-3 w-1/2 rounded bg-slate-700/70"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UsersLoadingSkeleton;
