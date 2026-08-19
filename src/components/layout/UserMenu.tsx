"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login">
        <Button variant="default" size="sm" className="hidden gap-1.5 md:inline-flex">
          <User className="h-4 w-4" />
          Login
        </Button>
      </Link>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("lodhaura_token");
    dispatch(logout());
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" className="hidden gap-2 md:inline-flex">
          <Avatar
            size="sm"
            fallback={user.name[0]}
            src={user.avatar}
            className="h-8 w-8 bg-gradient-village text-white"
          />
          <span className="max-w-[100px] truncate text-sm font-medium">{user.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="end">
        <DropdownMenuLabel>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          My Dashboard
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            <Shield className="mr-2 h-4 w-4" />
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
