import { logout } from "@/store/authSlice"
import { store } from "@/store/store"
import axios from "axios"
import { toast } from "sonner"

export const API = axios.create({
  baseURL: process.env.IMAGE_SAAS_API || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
})


API.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401 || status === 403) {
      toast.error("Session expired. Please log in again.")
      store.dispatch(logout())
      window.location.href = "/login"
    }

    if (status === 500) {
      toast.error("Server error. Please try again later.")
    }

    if (error?.response?.data?.detail) {
      toast.error(error.response.data.detail)
    }

    return Promise.reject(error)
  }
)
