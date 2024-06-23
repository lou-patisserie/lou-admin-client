import { LoginParams, ProfileBody, ProfileParams } from "@/types/api-types";
import { api } from "./api-config";

export const authLogin = async (params: LoginParams) => {
  try {
    const response = await api.post("/auth/login", params);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const adminProfile = async (token: string, body: ProfileParams) => {
  try {
    const response = await api.post("/users/profile", body, {
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

export const adminProfileById = async (token: string, id: string) => {
  try {
    const response = await api.get(`/users/${id}`, {
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

export const editProfile = async (token: string, profileId: string, body: ProfileBody) => {
  try {
    const response = await api.put(`/users/${profileId}`, body, {
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
