import React, {
    useRef,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";
import { LogOutIcon, VolumeIcon, VolumeOffIcon } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound =
    typeof Audio !== "undefined" ? new Audio("/sounds/mouse-click.mp3") : null;

const ProfileHeader: React.FC = () => {
    const { logout, authUser, updateProfile } = useAuthStore();
    const { isSoundEnabled, toggleSound } = useChatStore();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            const result = reader.result;
            if (typeof result !== "string") return;

            setSelectedImage(result);

            try {
                await updateProfile({ profilePic: result });
            } catch (err) {
                console.error("Error updating profile picture:", err);
            }
        };

        reader.onerror = () => {
            console.error("Error reading file:");
        };
    };

    const handleAvatarClick = (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        fileInputRef.current?.click();
    };

    const profileImageSrc =
        selectedImage || authUser?.profilePic || "/avatar.png";

    return (
        <div className="border-b border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* AVATAR */}
                    <div className="avatar online">
                        <button
                            className="group relative size-14 overflow-hidden rounded-full"
                            onClick={handleAvatarClick}
                            type="button"
                        >
                            <img
                                src={profileImageSrc}
                                alt="User avatar"
                                className="size-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="text-xs text-white">Change</span>
                            </div>
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* USERNAME & ONLINE TEXT */}
                    <div>
                        <h3 className="max-w-[180px] truncate text-base font-medium text-slate-200">
                            {authUser?.fullname ?? "User"}
                        </h3>
                        <p className="text-xs text-slate-400">Online</p>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-4">
                    {/* LOGOUT BUTTON */}
                    <button
                        className="text-slate-400 transition-colors hover:text-slate-300"
                        onClick={logout}
                        type="button"
                    >
                        <LogOutIcon className="size-5" />
                    </button>

                    {/* SOUND TOGGLE */}
                    <button
                        className="text-slate-400 transition-colors hover:text-slate-300"
                        onClick={() => {
                            if (mouseClickSound) {
                                mouseClickSound.currentTime = 0;
                                mouseClickSound
                                    .play()
                                    .catch((err) => console.log("Audio play failed:", err));
                            }
                            toggleSound();
                        }}
                        type="button"
                    >
                        {isSoundEnabled ? (
                            <VolumeIcon className="size-5" />
                        ) : (
                            <VolumeOffIcon className="size-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
