import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/error";

export type ChatTab = "chats" | "contacts";

export type ChatUser = {
  _id: string;
  fullname: string;
  email: string;
  profilePic?: string;
};

export type ChatMessage = {
  _id: string;
  senderId: string;
  receiverId: string;
  image?: string;
  text?: string;
  createdAt: Date;
};

type ChatStore = {
  allContacts: ChatUser[];
  chats: ChatUser[];
  messages: ChatMessage[];
  activeTab: ChatTab;
  selectedUser: ChatUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;

  toggleSound: () => void;
  setActiveTab: (tab: ChatTab) => void;
  setSelectedUser: (user: ChatUser | null) => void;
  getAllContacts: () => Promise<void>;
  getChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
};

const getInitialSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  const value = localStorage.getItem("isSoundEnabled");
  return value ? value === "true" : true;
};

export const useChatStore = create<ChatStore>((set) => ({
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
      const res = await axiosInstance.get<ChatUser[]>("/messages/contacts");
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
      const res = await axiosInstance.get<ChatUser[]>("/messages/chats");
      set({ chats: res.data });
    } catch (err) {
      const message = getErrorMessage(err, "Error getting chat partners");
      toast.error(message);
      console.error("Error in getChatPartners:", err);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      // adjust the endpoint if your backend uses a different path
      const res = await axiosInstance.get<ChatMessage[]>(
        `/messages/${userId}`
      );
      set({ messages: res.data });
    } catch (err) {
      const message = getErrorMessage(err, "Error getting messages with user");
      toast.error(message);
      console.error("Error getting messages with user:", err);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));