import AuthForm from "../../components/AuthForm.js";

export const metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}