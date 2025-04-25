import axios from "axios"
import { toast } from "react-toastify"
 //const baseURL = "http://localhost:5000/api"  
//  const baseURL = "https://employers-attendence.onrender.com/api" 

// export const api = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })


// Create an Axios instance with the base API URL
export const api = axios.create({
  baseURL: 'https://employers-attendence.onrender.com/api', // Use environment variables or a hardcoded URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle token expiration and standardize error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      toast.error("Your session has expired. Please login again.")
    }

    // Standardize error messages
    const errorMessage = error.response?.data?.message || "An unexpected error occurred"

    // Don't show toast for 401 errors as we're redirecting
    if (error.response?.status !== 401) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  },
)

// Helper function to handle API errors in components
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data.message || "An error occurred"
  }
  return "An unexpected error occurred"
}
