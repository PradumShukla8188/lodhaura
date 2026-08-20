"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/auth-schemas";
import { authApi } from "@/lib/api-services";
import { getApiErrorMessage } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmitting(true);
    try {
      const res = await authApi.forgotPassword(data);
      const token = res.data?.data?.resetToken;
      if (token) setDevToken(token);
      setSent(true);
      toast.success("If your email exists, a reset link has been sent.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not send reset link."));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-semibold">Check your email</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent password reset instructions to your email. The link expires in 1 hour.
          </p>
        </div>
        {devToken && (
          <Link href={`/reset-password?token=${devToken}`}>
            <Button variant="secondary" className="w-full">
              Reset Password (Dev Link)
            </Button>
          </Link>
        )}
        <Link href="/login">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Enter your registered email. We will send you a link to reset your password.
      </p>
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
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Send Reset Link"
        )}
      </Button>
      <Link
        href="/login"
        className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
    </form>
  );
}
