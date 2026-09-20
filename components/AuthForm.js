"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(isSignup ? error.message : "Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Auth service is not configured.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell auth-shell">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="eyebrow">Contributor accounts</p>
        <h1 id="auth-title">{isSignup ? "Create your archive account." : "Log in to your account."}</h1>
        <p>
          {isSignup
            ? "Sign up with email and password. Contribution tools arrive next sprint."
            : "Return to the archive front door with your contributor account."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />

          {message ? <p className="auth-message" role="alert">{message}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Working..." : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? "Already have an account? " : "Need an account? "}
          <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Sign up"}</Link>
        </p>
      </section>
    </main>
  );
}