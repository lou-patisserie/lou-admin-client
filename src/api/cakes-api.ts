import { api } from "./api-config";
import { CakeQueryParams } from "../types/api-types";

export const getCakesByFlexQueries = async (params: CakeQueryParams) => {
  try {
    const response = await api.get("/cakes/search", { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCakeById = async (cakeId: string) => {
  try {
    const response = await api.get(`/cakes/${cakeId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCakeByName = async (cakeName: string) => {
  try {
    const response = await api.get(`/cakes/name/${cakeName}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
