import { api } from "./api-config";

export const getAllAddOns = async () => {
  try {
    const response = await api.get("/add-ons");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
