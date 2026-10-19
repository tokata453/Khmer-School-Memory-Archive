import AuthForm from "../../components/AuthForm.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";

export const metadata = {
  title: "Sign Up",
};

export default async function SignupPage() {
  const language = normalizeLanguage((await cookies()).get("language")?.value);
  return <AuthForm mode="signup" language={language} />;
}