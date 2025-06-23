"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { login, logout, refreshToken } from "@/lib/auth"
import type { User, AuthContextType } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("refreshToken")
      if (token) {
        try {
          const userData = await refreshToken()
          setUser(userData)
        } catch (error) {
          console.error("Failed to refresh token:", error)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const loginUser = async (email: string, password: string) => {
    const userData = await login({ email, password })
    setUser(userData)
  }

  const logoutUser = async () => {
    await logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>{children}</AuthContext.Provider>
}
