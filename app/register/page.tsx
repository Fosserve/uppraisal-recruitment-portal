"use client"
import { useState } from "react";
import { Client, Account, ID } from "appwrite";
import Link from "next/link";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67a19ec80028558214f2"); 

const account = new Account(client);

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await account.create(ID.unique(), formData.email, formData.password, formData.username);
      alert("Registration successful!");
      window.location.href = "/dashboard"; // Redirect to dashboard after success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">SignUp to your account</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 sm:mx-auto sm:w-full sm:max-w-sm rounded-lg">

      <div>
        <label htmlFor="email" className="block text-sm/6 font-semibold font-medium text-gray-900">Email</label>
        <input 
        id="email"
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
          required 
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm/6 font-semibold font-medium text-gray-900">Username</label>
        <input 
        id="username"
          type="username" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
          required 
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm/6 font-semibold font-medium text-gray-900">Password</label>
        <input 
        id="password"
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
          required 
        />
      </div>
      <button 
        type="submit" 
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500" 
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="text-sm text-gray-600">Already have an account? <span className="text-indigo-600 font-semibold">{" "}<Link href="/login">Sign in</Link></span></p>
    </form>
    </div>
    </div>
  );
};

export default RegisterForm;
