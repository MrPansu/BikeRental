import { create } from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  user: null,
  token: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/auth/login", credentials);
      set({
        user: response.data.user,
        token: response.data.token,
        loading: false,
      });
    } catch (error) {
      throw error;
      set({ error: error.message, loading: false });
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/auth/register", userData);
      set({
        user: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
  },

  getAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/user");
      set({ users: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/user/${id}`, userData);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? response.data.data : user
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/user/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useUserStore;
