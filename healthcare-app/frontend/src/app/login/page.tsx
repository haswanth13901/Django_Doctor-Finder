"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, fetchWithAuth } from "@/utils/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(username, password);
      alert("Login successful!");

      const data = await fetchWithAuth("http://127.0.0.1:8000/api/doctors/");
      console.log("Protected API data:", data);

      router.push("/home");
    } catch (err: any) {
      alert("Login failed or token expired.");
      console.error("Login Error:", err.response?.data || err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/background_image.jpg')" }}
    >
      <div className="bg-[#1e293b]/90 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#334155] text-white border border-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#334155] text-white border border-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-semibold text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}
