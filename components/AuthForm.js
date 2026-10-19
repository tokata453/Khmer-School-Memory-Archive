"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { getTranslation } from "../lib/translations.js";

export default function AuthForm({ mode, language }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const t = getTranslation(language).auth;
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
        console.error(isSignup ? "Could not create account" : "Could not log in", error);
        setMessage(isSignup ? t.signupError : t.loginError);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage(t.unavailable);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell auth-shell">
      <section className="auth-panel" aria-labelledby="auth-title">
        <h1 id="auth-title">{isSignup ? t.signupTitle : t.loginTitle}</h1>
        <p>
          {isSignup
            ? t.signupIntro
            : t.loginIntro}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">{t.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">{t.password}</label>
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
            {isSubmitting ? t.working : isSignup ? t.signup : t.login}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? `${t.haveAccount} ` : `${t.needAccount} `}
          <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? t.login : t.signup}</Link>
        </p>
      </section>
    </main>
  );
}