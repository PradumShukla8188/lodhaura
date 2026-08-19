import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Join the Community"
      subtitle="Create an account to participate in village discussions"
      footerLink={{ text: "Already have an account?", label: "Sign in", href: "/login" }}
    >
      <SignupForm />
    </AuthLayout>
  );
}
