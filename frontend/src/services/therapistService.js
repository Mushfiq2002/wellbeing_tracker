import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getTherapists = async () => {
  const response = await axios.get(`${API_URL}/therapists`);
  return response.data;
};