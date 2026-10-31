import AuthForm from "../../components/AuthForm.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { safeNextPath } from "../../lib/auth.js";

export const metadata = {
  title: "Sign Up",
};

export default async function SignupPage({ searchParams }) {
  const language = normalizeLanguage((await cookies()).get("language")?.value);
  const { next } = await searchParams;
  return <AuthForm mode="signup" language={language} nextPath={safeNextPath(next)} />;
}