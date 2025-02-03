"use client"

import { useState } from "react"
import { useUser } from "../contexts/UserContext"

interface LoginScreenProps {
  onLogin: () => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const { users, login, addUser } = useUser()
  const [username, setUsername] = useState("")

  const handleLogin = () => {
    if (users.some((user) => user.username === username)) {
      login(username)
      onLogin()
    } else {
      alert("User not found. Please create a new user.")
    }
  }

  const handleAddUser = () => {
    if (users.some((user) => user.username === username)) {
      alert("Username already exists. Please choose a different username.")
    } else {
      addUser(username)
      onLogin()
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700"
        />
        <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded mb-2">
          Login
        </button>
        <button onClick={handleAddUser} className="w-full bg-green-500 text-white p-2 rounded">
          Create New User
        </button>
      </div>
    </div>
  )
}

