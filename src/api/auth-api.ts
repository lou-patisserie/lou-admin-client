import { LoginParams, ProfileParams } from "@/types/api-types";
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
