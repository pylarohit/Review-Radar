import AuthForm from "@/components/auth/AuthForm";

export const metadata = { title: "Log In — Review Radar" };

export default function LoginPage() {
  return(
    <>
    <AuthForm mode="login" />
    </>
  )
}
