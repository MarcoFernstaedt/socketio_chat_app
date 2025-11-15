import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/error";

type ChatTab = "chats" | "contacts";

type ChatStore = {
  allContacts: unknown[];
  chats: unknown[];
  messages: unknown[];
  activeTab: ChatTab;
  selectedUser: unknown | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;

  toggleSound: () => void;
  setActiveTab: (tab: ChatTab) => void;
  setSelectedUser: (user: unknown | null) => void;
  getAllContacts: () => Promise<void>;
  getChatPartners: () => Promise<void>;
};

const getInitialSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  const value = localStorage.getItem("isSoundEnabled");
  return value ? value === "true" : true;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: getInitialSoundEnabled(),

  toggleSound: () =>
    set((state) => {
      const next = !state.isSoundEnabled;
      if (typeof window !== "undefined") {
        localStorage.setItem("isSoundEnabled", String(next));
      }
      return { isSoundEnabled: next };
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (err) {
      const message = getErrorMessage(err, "Error getting all contacts");
      toast.error(message);
      console.error("Error in getAllContacts:", err);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getChatPartners: async () => {
    set({ isUsersLoading: true });

    try {
      // adjust endpoint if you have a different one for chat partners
      const res = await axiosInstance.get("/messages/contacts");
      set({ chats: res.data });
    } catch (err) {
      const message = getErrorMessage(err, "Error getting chat partners");
      toast.error(message);
      console.error("Error in getChatPartners:", err);
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));