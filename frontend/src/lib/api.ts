import axios from "axios"

export const api = axios.create({
  baseURL: process.env.IMAGE_SAAS_API || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
})