import { ProductTypesParams } from "@/types/api-types";
import { api } from "./api-config";

export const getAllProductTypes = async () => {
  try {
    const response = await api.get("/product-types");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProductType = async (typeId: string) => {
  try {
    const response = await api.delete(`/product-types/${typeId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addProductType = async (params: ProductTypesParams) => {
  try {
    const response = await api.post(`/product-types`, params);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProductTypeById = async (typeId: string) => {
  try {
    const response = await api.get(`/product-types/${typeId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editProductType = async (typeId: string, params: ProductTypesParams) => {
  try {
    const response = await api.put(`/product-types/${typeId}`, params);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
