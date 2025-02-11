// src/api/BaseApi.js
import axios, { AxiosError, AxiosInstance } from "axios";

class BaseApi {
  apiUrl = process.env.NEXT_API_URL || "http://localhost:8000";
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: this.apiUrl, // Fixed API URL
      timeout: 10000, // Optional: 10-second timeout
    });

    // Request Interceptor (for adding auth tokens)
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem("authToken"); // Example: Get token from localStorage
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response Interceptor (for global error handling)
    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
      },
    );
  }

  // Generic GET request
  async get(endpoint: string, params: any = {}, config: any = {}) {
    try {
      const response = await this.api.get(endpoint, { params, ...config });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // Generic POST request
  async post(endpoint: string, data: any = {}, config: any = {}) {
    try {
      const response = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // Generic PUT request
  async put(endpoint: string, data = {}, config = {}) {
    try {
      const response = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // Generic DELETE request
  async delete(endpoint: string, config = {}) {
    try {
      const response = await this.api.delete(endpoint, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

export default new BaseApi(); // Exporting as a singleton for easy import
