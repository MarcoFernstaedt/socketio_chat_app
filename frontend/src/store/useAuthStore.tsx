import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getErrorMessage } from "../lib/error";

export type AuthUser = {
    _id: string;           // matches your backend _id
    email: string;
    fullname: string;
    profilePic?: string;   // optional in backend
    // createdAt?: string;
    // updatedAt?: string;
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

    checkAuth: () => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

    // Verify logged-in user on app load
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get<AuthUser>("/auth/me");
            set({ authUser: res.data });
        } catch (error) {
            console.error("Auth check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // Handle user signup
    signup: async ({ fullname, email, password }) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post<AuthUser>("/auth/sign-up", {
                fullname,
                email,
                password,
            });

            set({ authUser: res.data });
            toast.success("Account created successfully!");
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

    // Handle user login
    login: async ({ email, password }) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post<AuthUser>("/auth/sign-in", {
                email,
                password,
            });

            set({ authUser: res.data });
            toast.success("Logged in successfully!");
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
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
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

    // Update logged-in user's profile (e.g., profilePic)
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
}));