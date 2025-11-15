import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

type AuthUser = {
    id: string;
    fullname: string;
    email: string;
};

type AuthStore = {
    authUser: AuthUser | null;
    isCheckingAuth: boolean;
    isSigningUp: boolean;

    checkAuth: () => Promise<void>;
    signup: (credentials: {
        fullname: string;
        email: string;
        password: string;
    }) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    // Verify logged-in user on app load
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            set({ authUser: res.data });
        } catch (err) {
            console.error("Auth check failed:", err);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // Handle user signup
    signup: async ({ fullname, email, password }) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post("/auth/sign-up", {
                fullname,
                email,
                password,
            });

            set({ authUser: res.data });
            toast.success("Account created successfully!");
        } catch (err: any) {
            const message =
                err?.response?.data?.message || "Something went wrong during signup.";
            toast.error(message);
            console.error("Signup error:", err);
        } finally {
            set({ isSigningUp: false });
        }
    },
}));