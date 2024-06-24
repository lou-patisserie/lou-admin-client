import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3001/api/v1",
  baseURL: "https://api-dev.loupatisserie.com/api/v1",
});
