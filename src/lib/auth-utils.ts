import type { User } from "@/store/slices/authSlice";

export function normalizeUser(apiUser: Record<string, unknown>): User {
  const roleId = apiUser.roleId as { name?: string } | undefined;
  const roleName =
    (apiUser.roleName as string) || roleId?.name || "user";

  return {
    id: String(apiUser._id || apiUser.id || ""),
    name: String(apiUser.name || ""),
    email: String(apiUser.email || ""),
    role: roleName === "admin" ? "admin" : "member",
    avatar: (apiUser.avatar as string) || undefined,
    phone: (apiUser.phone as string) || undefined,
    bio: (apiUser.bio as string) || undefined,
  };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string; errors?: { msg?: string }[] };
    if (data.message) return data.message;
    if (data.errors?.[0]?.msg) return data.errors[0].msg;
  }
  return fallback;
}
