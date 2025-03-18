"use client";
import { useState } from "react";
import Link from "next/link";
import { account } from "../appwrite";
import { useRouter } from "next/navigation"

interface User {
  name: string;
}

const LoginPage: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      console.log("Logged in user:", user); 
      setLoggedInUser(user);
      router.push("/dashboard"); 
    } catch (error: any) {
      console.error("Login Error:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/uppraisal-logo.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6  font-semibold text-gray-900"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#065de8] sm:text-sm/6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-semibold  text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[#065de8] hover:text-[#2498ff]"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#065de8] sm:text-sm/6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => login(email, password)}
            className="w-full rounded-md bg-[#065de8] px-4 py-2 text-white hover:bg-[#2498ff]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
