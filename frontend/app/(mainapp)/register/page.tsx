"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/services/authServise";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  if (isLoggedIn) router.push("/all");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      console.log("Registration successful");
      router.push("/login");
    } else {
      const errorData = await response.json();
      setError(errorData.detail || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-6 rounded-lg">
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", width: "300px" }}
        >
          <h2 className="text-xl font-semibold text-center">Register</h2>
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
            <p className="mb-2">Email:</p>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <Button type="submit" className="p-4 mt-2">
            Register
          </Button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
