import { create } from "zustand";
import axios from "axios";

const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  error: null,

  getAllTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/transaction");
      set({ transactions: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTransaction: async (transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/transaction", transactionData);
      set((state) => ({
        transactions: [...state.transactions, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateTransaction: async (id, transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `/api/transaction/${id}`,
        transactionData
      );
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction._id === id ? response.data.data : transaction
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/transaction/${id}`);
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction._id !== id
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useTransactionStore;
