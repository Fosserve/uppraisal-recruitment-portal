"use client";
import { useState } from "react";
import Link from "next/link";
import { account, ID } from "../appwrite";
import { useRouter } from "next/navigation"
import PostJob from "../components/jobposting";



interface User {
  name: string;
}

const LoginPage: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false);


  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      
      // Fetch user details after successful login
      const user = await account.get();
      console.log("Logged in user:", user); // Debugging log
      setLoggedInUser(user);
  
      router.push("/dashboard"); // Redirect after login
    } catch (error: any) {
      console.error("Login Error:", error); // Log error for debugging
      setError(error.message || "Login failed. Please check your credentials.");
    }
  };

  const logoutAll = async () => {
    try {
      await account.deleteSessions(); // Ends all active sessions
      setLoggedInUser(null);
      router.push("/login"); // Redirect to login after logout
    } catch (error: any) {
      console.error("Logout Error:", error);
      setError("Failed to logout from all devices. Please try again.");
    }
  };
  const register = async () => {
    try {
      await account.create(ID.unique(), email, password, name);
      router.push("/dashboard")
      await login(email, password);
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setLoggedInUser(null);
    } catch (error) {
      setError("Logout failed. Please try again.");
    }
  };

  // if (loggedInUser) {
  //   return (
  //     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
  //     <div className="flex justify-between items-center mb-3">
  //       <p className="text-center text-lg text-gray-900/80 font-bold">
  //         Logged in as <span className="text-indigo-700">{loggedInUser.name}</span>
  //       </p>
  //       <button
  //         onClick={logout}
  //         className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
  //       >
  //         Logout
  //       </button>
  //     </div>

  //     {/* Open Modal Button */}
  //     <button
  //       onClick={() => setIsModalOpen(true)}
  //       className="mt-4 mb-4 w-fit rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
  //     >
  //       Post a Job
  //     </button>

  //     {/* Modal Component */}
  //     {isModalOpen && (
  //       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  //         <div className="bg-white rounded-lg max-h-[32rem] overflow-y-auto shadow-lg p-6 w-full max-w-3xl">
  //           <div className="flex justify-between items-center mb-4">
  //             <h2 className="text-lg text-gray-700 font-semibold">Post a Job</h2>
  //             <button
  //               onClick={() => setIsModalOpen(false)}
  //               className="text-gray-500 hover:text-gray-700 text-lg"
  //             >
  //               ✖
  //             </button>
  //           </div>
  //           {/* PostJob Component inside Modal */}
  //           <PostJob />
  //         </div>
  //       </div>
  //     )}
  //   </div>

  //   );
  // }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white h-screen">
      <button
  onClick={logoutAll}
  className="mt-4 rounded-md fixed top-0 bg-red-600 px-4 py-2 text-white hover:bg-red-500"
>
  Logout from All Devices
</button>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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
              className="block text-sm/6 font-semibold font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-semibold font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>{" "}
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => login(email, password)}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Sign in
          </button>
          <Link
            href="/register"
            className="w-full block text-center rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
          >
            Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
