import axios from "axios";

// baseURL: "http://localhost:3001/api/v1",

export const api = axios.create({
  baseURL: "https://api-dev.loupatisserie.com/api/v1",
});
