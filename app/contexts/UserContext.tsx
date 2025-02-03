"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  theme: string
}

interface UserContextType {
  currentUser: User | null
  users: User[]
  login: (username: string) => void
  logout: () => void
  addUser: (username: string) => void
  changeTheme: (theme: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users))
  }, [users])

  const login = (username: string) => {
    const user = users.find((u) => u.username === username)
    if (user) {
      setCurrentUser(user)
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const addUser = (username: string) => {
    const newUser = { id: Date.now().toString(), username, theme: "light" }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
  }

  const changeTheme = (theme: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, theme }
      setCurrentUser(updatedUser)
      setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)))
    }
  }

  return (
    <UserContext.Provider value={{ currentUser, users, login, logout, addUser, changeTheme }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

