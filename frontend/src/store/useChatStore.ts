import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/error";
import { useAuthStore } from "./useAuthStore";

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
  createdAt: string; // backend usually returns ISO string
  isOptimistic?: boolean;
};

export type NewMessagePayload = {
  text?: string;
  image?: string;
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
  sendMessage: (payload: NewMessagePayload) => Promise<void>;
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

  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get<ChatMessage[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      const message = getErrorMessage(err, "Error getting messages with user");
      toast.error(message);
      console.error("Error getting messages with user:", err);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (payload) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    if (!authUser) {
      toast.error("You must be logged in to send messages");
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: ChatMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: payload.text,
      image: payload.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Add optimistic message
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      const res = await axiosInstance.post<ChatMessage>(
        `/messages/send/${selectedUser._id}`,
        payload
      );

      // Replace optimistic message with real one
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? res.data : msg
        ),
      }));
    } catch (err) {
      // Remove optimistic message on error
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));

      const message = getErrorMessage(err, "Error sending message");
      toast.error(message);
      console.error("Error sending message:", err);
    }
  },
}));
