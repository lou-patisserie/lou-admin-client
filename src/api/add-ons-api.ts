import { AddOnsTypeParams } from "@/types/api-types";
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

export const addAddOns = async (token: string | null, userId: string, params: AddOnsTypeParams) => {
  const body = { user_id: userId, ...params };
  try {
    const response = await api.post(`/add-ons`, body, {
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

export const getAddOnsbyName = async (addOnsName: string) => {
  try {
    const response = await api.get(`/add-ons/search`, { params: { name: addOnsName } });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editAddOns = async (
  token: string | null,
  userId: string,
  AddOnsId: string,
  params?: AddOnsTypeParams
) => {
  const body = { user_id: userId, ...params };
  try {
    const response = await api.put(`/add-ons/${AddOnsId}`, body, {
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

export const deleteAddOns = async (token: string | null, id: string) => {
  try {
    const response = await api.delete(`/add-ons/${id}`, {
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
