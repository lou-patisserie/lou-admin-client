import axios from "axios";

// baseURL: "http://localhost:3001/api/v1",

export const api = axios.create({
  baseURL: "http://localhost:3001/api/v1",
});
