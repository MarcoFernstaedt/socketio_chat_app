import React from "react";
import { LoaderIcon } from "lucide-react";

const PageLoader: React.FC = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <LoaderIcon className="size-10 animate-spin text-cyan-400" />
        </div>
    );
};

export default PageLoader;