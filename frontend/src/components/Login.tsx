"use client";

import { useState } from "react";

type LoginProps = {
  onLogin: () => void;
};

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "user" && password === "password") {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)]">
      <div className="w-full max-w-sm rounded-[32px] border border-[var(--stroke)] bg-white/90 backdrop-blur p-8 shadow-[var(--shadow)]">
        <h1 className="mb-6 py-2 text-center font-display text-3xl font-semibold text-[var(--navy-dark)]">
          Kanban Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--gray-text)]">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-[var(--stroke)] p-3 text-sm focus:border-[var(--primary-blue)] focus:outline-none"
              placeholder="user"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--gray-text)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--stroke)] p-3 text-sm focus:border-[var(--primary-blue)] focus:outline-none"
              placeholder="password"
            />
          </div>
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-[var(--secondary-purple)] p-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
