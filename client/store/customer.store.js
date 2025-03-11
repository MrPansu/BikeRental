import { create } from "zustand";
import axios from "axios";

const useCustomerStore = create((set) => ({
  customers: [],
  loading: false,
  error: null,

  getAllCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/customer");
      set({ customers: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addCustomer: async (customerData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/customer", customerData);
      set((state) => ({
        customers: [...state.customers, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateCustomer: async (id, customerData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/customer/${id}`, customerData);
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer._id === id ? response.data.data : customer
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/customer/${id}`);
      set((state) => ({
        customers: state.customers.filter((customer) => customer._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useCustomerStore;
