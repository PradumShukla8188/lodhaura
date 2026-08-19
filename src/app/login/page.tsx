import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your dashboard and community features"
      footerLink={{ text: "Don't have an account?", label: "Sign up", href: "/signup" }}
    >
      <LoginForm />
    </AuthLayout>
  );
}
