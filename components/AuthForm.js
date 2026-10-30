"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { getTranslation } from "../lib/translations.js";

const styles = { shell: { minHeight: "68vh", display: "grid", placeItems: "center", padding: "72px 0" }, panel: { width: "min(100%, 520px)", padding: "34px", background: "var(--paper)", border: "2px solid var(--carbon)", boxShadow: "8px 8px 0 rgba(41, 37, 33, .14)" }, title: { margin: "16px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: 800, lineHeight: .82 }, intro: { color: "var(--muted)", lineHeight: 1.7 }, form: { display: "grid", gap: "12px", marginTop: "28px" }, label: { fontFamily: "var(--font-interface)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }, input: { width: "100%", padding: "14px", border: "1px solid var(--carbon)", background: "var(--paper)", color: "var(--carbon)", font: "inherit" }, button: { marginTop: "10px", padding: "14px 16px", border: "1px solid var(--carbon)", background: "var(--carbon)", color: "var(--paper)", fontFamily: "var(--font-interface)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", cursor: "pointer" }, message: { margin: "2px 0 0", color: "var(--vermilion)" }, switch: { margin: "22px 0 0", color: "var(--muted)", fontFamily: "var(--font-interface)", fontSize: "0.9rem", lineHeight: 1.7 }, switchLink: { color: "var(--carbon)", fontWeight: 700 } };

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
    <main className="page-shell auth-shell" style={styles.shell}>
      <section className="auth-panel" style={styles.panel} aria-labelledby="auth-title">
        <h1 style={styles.title} id="auth-title">{isSignup ? t.signupTitle : t.loginTitle}</h1>
        <p style={styles.intro}>
          {isSignup
            ? t.signupIntro
            : t.loginIntro}
        </p>

        <form className="auth-form" style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="email">{t.email}</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label} htmlFor="password">{t.password}</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            style={styles.input}
          />

          {message ? <p className="auth-message" style={styles.message} role="alert">{message}</p> : null}

          <button style={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.working : isSignup ? t.signup : t.login}
          </button>
        </form>

        <p className="auth-switch" style={styles.switch}>
          {isSignup ? `${t.haveAccount} ` : `${t.needAccount} `}
          <Link style={styles.switchLink} href={isSignup ? "/login" : "/signup"}>{isSignup ? t.login : t.signup}</Link>
        </p>
      </section>
    </main>
  );
}