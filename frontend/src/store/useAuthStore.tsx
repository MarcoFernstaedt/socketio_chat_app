import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/error";

const BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "/";

export type AuthUser = {
    _id: string;
    email: string;
    fullname: string;
    profilePic?: string;
};

export type SignupCredentials = {
    fullname: string;
    email: string;
    password: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type UpdateProfilePayload = {
    profilePic: string;
};

type AuthStore = {
    authUser: AuthUser | null;
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;

    socket: Socket | null;
    onlineUsers: string[];

    checkAuth: () => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (payload: UpdateProfilePayload) => Promise<void>;

    connectSocket: () => void;
    disconnectSocket: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    // Verify logged-in user on app load
    checkAuth: async () => {
        const { connectSocket } = get();
        try {
            const res = await axiosInstance.get<AuthUser>("/auth/me");
            set({ authUser: res.data });
            connectSocket()
        } catch (error) {
            console.error("Auth check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async ({ fullname, email, password }) => {
        const { connectSocket } = get();
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post<AuthUser>("/auth/sign-up", {
                fullname,
                email,
                password,
            });

            set({ authUser: res.data });
            toast.success("Account created successfully!");
            connectSocket();
        } catch (err) {
            const message = getErrorMessage(
                err,
                "Something went wrong during signup."
            );
            toast.error(message);
            console.error("Signup error:", err);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async ({ email, password }) => {
        const { connectSocket } = get();
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post<AuthUser>("/auth/sign-in", {
                email,
                password,
            });

            set({ authUser: res.data });
            toast.success("Logged in successfully!");
            connectSocket();
        } catch (err) {
            const message = getErrorMessage(
                err,
                "Something went wrong during login."
            );
            toast.error(message);
            console.error("Login error:", err);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        const { disconnectSocket } = get();

        try {
            await axiosInstance.post("/auth/logout");
            disconnectSocket();
            set({ authUser: null, onlineUsers: [] });
            toast.success("Logged out successfully!");
        } catch (err) {
            const message = getErrorMessage(
                err,
                "Something went wrong during logout."
            );
            toast.error(message);
            console.error("Error logging out:", err);
        }
    },

    updateProfile: async (payload) => {
        try {
            const res = await axiosInstance.put<AuthUser>("/users/me", payload);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (err) {
            const message = getErrorMessage(err, "Error updating profile.");
            toast.error(message);
            console.error("Error updating profile:", err);
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser) return;
        if (socket?.connected) return;

        const newSocket = io(BASE_URL, {
            withCredentials: true,
        });

        // handle online users event
        newSocket.on("getOnlineUsers", (userIds: string[]) => {
            set({ onlineUsers: userIds });
        });

        // optional: clean up on socket-level disconnect
        newSocket.on("disconnect", () => {
            set({ onlineUsers: [] });
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (!socket) return;
        socket.disconnect();
        set({ socket: null, onlineUsers: [] });
    },
}));