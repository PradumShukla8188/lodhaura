"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { profileApi } from "@/lib/api-services";
import { normalizeUser } from "@/lib/auth-utils";
import { setCredentials, logout } from "@/store/slices/authSlice";

export function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("lodhaura_token");
    if (!token) return;

    const cached = localStorage.getItem("lodhaura_user");
    if (cached) {
      try {
        const user = JSON.parse(cached);
        dispatch(setCredentials({ user, token }));
      } catch {
        localStorage.removeItem("lodhaura_user");
      }
    }

    profileApi
      .getMe()
      .then((res) => {
        const user = normalizeUser(res.data.data.user as Record<string, unknown>);
        localStorage.setItem("lodhaura_user", JSON.stringify(user));
        dispatch(setCredentials({ user, token }));
      })
      .catch(() => {
        localStorage.removeItem("lodhaura_token");
        localStorage.removeItem("lodhaura_user");
        dispatch(logout());
      });
  }, [dispatch]);

  return <>{children}</>;
}
