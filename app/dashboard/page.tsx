"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { account } from "../appwrite"
import PostJob from "../components/jobposting"

export default function AdminDashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  const logout = async () => {
    try {
      await account.deleteSession("current")
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col justify-start px-6 py-12 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div>
          <p className="text-gray-600 mr-4 inline-block">
            Welcome, <span className="font-semibold">{user.name}</span>
          </p>
          <button
            onClick={logout}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 mb-4 w-fit rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
      >
        Post a Job
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg max-h-[32rem] overflow-y-auto shadow-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-gray-700 font-semibold">Post a Job</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✖
              </button>
            </div>
            <PostJob />
          </div>
        </div>
      )}

      {/* Add more admin dashboard content here */}
    </div>
  )
}