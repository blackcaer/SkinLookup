"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/services/authServise";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        const response = await fetch(
          "http://127.0.0.1:8000/api/is_authenticated/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setIsAuthenticated(true);
          router.push("/all");
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setIsAuthenticated(true);
      console.log("Login successful");
      router.push("/all");
    } else {
      const errorData = await response.json();
      setError(errorData.detail || "Login failed");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
    >
      <div className="border p-6 rounded-lg">
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", width: "300px" }}
        >
          <h2 className="text-xl font-semibold text-center">Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
         
          <label className="py-4">
            <p className="mb-2">Username:</p>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="py-4">
            <p className="mb-2">Password:</p>
            
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <Button type="submit" className="p-4 mt-2">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
