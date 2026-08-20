"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/lib/auth-schemas";
import { authApi } from "@/lib/api-services";
import { getApiErrorMessage } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-1.5 text-xs ${ok ? "text-secondary" : "text-muted-foreground"}`}>
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </li>
  );
}

export function SignupForm() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";

  const rules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const onSubmit = async (data: SignupFormData) => {
    setSubmitting(true);
    try {
      await authApi.register(data);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Registration failed. Email may already be in use."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register("password")}
        />
        <ul className="mt-2 space-y-1 rounded-lg bg-muted/50 p-3">
          <PasswordRule ok={rules.length} label="At least 6 characters" />
          <PasswordRule ok={rules.upper} label="One uppercase letter" />
          <PasswordRule ok={rules.number} label="One number" />
        </ul>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {confirmPassword && !rules.match && !errors.confirmPassword && (
          <p className="text-xs text-destructive">Passwords do not match</p>
        )}
        {rules.match && confirmPassword && (
          <p className="text-xs text-secondary">Passwords match</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
