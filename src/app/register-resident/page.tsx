import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterResidentWizard } from "@/components/auth/RegisterResidentWizard";

export const metadata: Metadata = {
  title: "Register as Resident",
};

export default function RegisterResidentPage() {
  return (
    <AuthLayout
      title="Village Resident Registration"
      subtitle="Create an official profile to manage your documents and household"
      footerLink={{ text: "Already registered?", label: "Sign in", href: "/login" }}
    >
      <RegisterResidentWizard />
    </AuthLayout>
  );
}
