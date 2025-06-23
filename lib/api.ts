import axios from "axios"
import type { User, Product, Category, OrderData } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getUserByEmail = async (email: string): Promise<User> => {
  const response = await api.get("/users", {
    params: { emailRequestDto: { email } },
  })
  return response.data
}

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.put("/users", userData)
  return response.data
}

export const getProducts = async (
  page: number,
  size: number,
  search = "",
  category: string | null = null,
): Promise<Product[]> => {
  const response = await api.get("/products", {
    params: { page, size, search, category },
  })
  return response.data
}

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories")
  return response.data
}

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, categoryData)
  return response.data
}

export const createCategory = async (categoryData: Omit<Category, "id">): Promise<Category> => {
  const response = await api.post("/categories", categoryData)
  return response.data
}

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`)
}

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, productData)
  return response.data
}

export const createProduct = async (productData: Omit<Product, "id" | "productId">): Promise<Product> => {
  const response = await api.post("/products", productData)
  return response.data
}

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`)
}

export const createOrder = async (orderData: OrderData): Promise<any> => {
  const response = await api.post("/orders", orderData)
  return response.data
}

export default api
