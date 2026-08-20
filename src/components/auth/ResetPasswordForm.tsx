"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/auth-schemas";
import { authApi } from "@/lib/api-services";
import { getApiErrorMessage } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successfully! Please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Reset failed. Link may have expired."));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-destructive">Invalid or missing reset link.</p>
        <Link href="/forgot-password">
          <Button variant="outline">Request New Link</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
        <KeyRound className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground">Create a new password for your account.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <PasswordInput
          id="password"
          placeholder="Min 6 chars, 1 uppercase, 1 number"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {confirmPassword && password === confirmPassword && (
          <p className="text-xs text-secondary">Passwords match</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}
