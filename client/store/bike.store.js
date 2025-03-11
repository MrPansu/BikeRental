import { create } from "zustand";
import axios from "axios";

const useBikeStore = create((set) => ({
  bikes: [],
  loading: false,
  error: null,

  getAllBikes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("api/bike");
      set({ bikes: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addBike: async (bikeData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`/api/bike/`, bikeData);
      set((state) => ({
        bikes: [...state.bikes, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateBike: async (id, bikeData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/bike/${id}`, bikeData);
      set((state) => ({
        bikes: state.bikes.map((bike) =>
          bike._id === id ? response.data.data : bike
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteBike: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/bike/${id}`);
      set((state) => ({
        bikes: state.bikes.filter((bike) => bike._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useBikeStore;
