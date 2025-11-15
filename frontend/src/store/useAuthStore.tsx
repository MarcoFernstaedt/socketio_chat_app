import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

type AuthUser = {
    id: string;
    fullname: string;
    email: string;
};

type SignupCredentials = {
    fullname: string;
    email: string;
    password: string;
};

type LoginCredentials = {
    email: string;
    password: string;
};

type ErrorWithResponse = {
    response?: {
        data?: {
            message?: string;
        };
    };
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
};

const getErrorMessage = (error: unknown, fallback: string): string => {
    const err = error as ErrorWithResponse;
    return err?.response?.data?.message ?? fallback;
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
}));