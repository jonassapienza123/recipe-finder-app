// src/LoginForm.tsx

import { useState } from "react";
import { loginWithEmail } from "./authService";

type LoginFormProps = {
  mode: "login";
};

export default function LoginForm({ mode }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await loginWithEmail(email, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign in</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">
        {mode === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

