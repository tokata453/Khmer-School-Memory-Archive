import AuthForm from "../../components/AuthForm.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";

export const metadata = {
  title: "Log In",
};

export default async function LoginPage() {
  const language = normalizeLanguage((await cookies()).get("language")?.value);
  return <AuthForm mode="login" language={language} />;
}