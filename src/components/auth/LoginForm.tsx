"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/auth-schemas";
import { authApi } from "@/lib/api-services";
import { normalizeUser, getApiErrorMessage } from "@/lib/auth-utils";
import { setCredentials, setLoading } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    dispatch(setLoading(true));
    try {
      const res = await authApi.login(data);
      const { token, user: rawUser } = res.data.data;
      const user = normalizeUser(rawUser);
      localStorage.setItem("lodhaura_token", token);
      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome back, ${user.name}!`);
      router.push((user.role === "admin" || user.role === "super_admin") ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Sign In"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Lodhaura?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}
