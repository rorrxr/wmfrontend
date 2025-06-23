import api from "./api"
import type { User } from "@/types"

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface SignUpData {
  email: string
  password: string
  name: string
  phone: string
  token: string
}

export const login = async (credentials: {
  email: string
  password: string
}): Promise<User> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials)
  localStorage.setItem("accessToken", response.data.accessToken)
  localStorage.setItem("refreshToken", response.data.refreshToken)
  return response.data.user
}

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout")
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

export const refreshToken = async (): Promise<User> => {
  const refreshToken = localStorage.getItem("refreshToken")
  const response = await api.post<LoginResponse>("/auth/refresh", {
    refreshToken,
  })
  localStorage.setItem("accessToken", response.data.accessToken)
  return response.data.user
}

export const signUp = async (userData: SignUpData): Promise<any> => {
  const response = await api.post(`/auth/signup?token=${userData.token}`, userData)
  return response.data
}

export const sendVerificationEmail = async (email: string): Promise<void> => {
  await api.post("/email-verifications/send", { email })
}

export const verifyEmail = async (email: string, authNum: string): Promise<{ token: string }> => {
  const response = await api.post("/email-verifications/verify", {
    email,
    authNum,
  })
  return response.data
}

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const response = await api.post("/auth/check-email", { email })
  return response.data.isAvailable
}
