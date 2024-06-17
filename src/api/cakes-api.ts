import { api } from "./api-config";
import { AddCakeParams, CakeQueryParams } from "../types/api-types";

export const getAllCakes = async () => {
  try {
    const response = await api.get("/cakes");
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

export const addCake = async (token: string | null, userId: string, params: AddCakeParams) => {
  const body = { user_id: userId, ...params };
  try {
    const response = await api.post(`/cakes`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCakebyId = async (cakeId: string) => {
  try {
    const response = await api.get(`/cakes/${cakeId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editCake = async (
  token: string | null,
  userId: string,
  cakeId: string,
  params?: AddCakeParams
) => {
  const body = { user_id: userId, ...params };
  try {
    const response = await api.put(`/cakes/${cakeId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCake = async (token: string | null, id: string) => {
  try {
    const response = await api.delete(`/cakes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
