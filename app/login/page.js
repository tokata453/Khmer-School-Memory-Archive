import AuthForm from "../../components/AuthForm.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { safeNextPath } from "../../lib/auth.js";

export const metadata = {
  title: "Log In",
};

export default async function LoginPage({ searchParams }) {
  const language = normalizeLanguage((await cookies()).get("language")?.value);
  const { next } = await searchParams;
  return <AuthForm mode="login" language={language} nextPath={safeNextPath(next)} />;
}