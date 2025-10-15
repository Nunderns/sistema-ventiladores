import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // ajuste se o back estiver em outra URL
});
