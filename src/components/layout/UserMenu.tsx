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
  Landmark,
  Map,
  FileText,
  IndianRupee,
  Activity,
  CheckSquare,
  Users,
  MessageSquareWarning,
  CalendarDays
} from "lucide-react";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { hasPermission } from "@/lib/rbac-utils";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
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
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden gap-2 md:inline-flex")}>
        <Avatar
          size="sm"
          fallback={user.name[0]}
          src={user.avatar}
          className="h-8 w-8 bg-gradient-village text-white"
        />
        <span className="max-w-[100px] truncate text-sm font-medium">{user.name}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
        
        {(hasPermission(user as any, 'Roles', 'View') || hasPermission(user as any, 'Departments', 'View') || hasPermission(user as any, 'Users', 'View') || user.role === 'admin') && (
          <>
            <DropdownMenuSeparator />
            
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Village Administration
            </div>

            {(hasPermission(user as any, 'Events', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/events")}>
                <CalendarDays className="mr-2 h-4 w-4 text-purple-400" />
                Event Management
              </DropdownMenuItem>
            )}
            
            {(hasPermission(user as any, 'Roles', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/roles")}>
                <Shield className="mr-2 h-4 w-4" />
                Roles & Permissions
              </DropdownMenuItem>
            )}
            
            {(hasPermission(user as any, 'Departments', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/departments")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Departments
              </DropdownMenuItem>
            )}
            
            {(hasPermission(user as any, 'Users', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/gov-users")}>
                <User className="mr-2 h-4 w-4" />
                Government Users
              </DropdownMenuItem>
            )}
            
            {(hasPermission(user as any, 'Government Schemes', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/schemes")}>
                <Landmark className="mr-2 h-4 w-4" />
                Government Schemes
              </DropdownMenuItem>
            )}
            
            {(hasPermission(user as any, 'Village Projects', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/projects")}>
                <Map className="mr-2 h-4 w-4" />
                Projects & Progress
              </DropdownMenuItem>
            )}
            
            {(hasPermission(user as any, 'Documents', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/documents")}>
                <FileText className="mr-2 h-4 w-4" />
                Documents & Records
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Funds', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/funds")}>
                <IndianRupee className="mr-2 h-4 w-4" />
                Project Funds
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Audit Logs', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/audit")}>
                <Activity className="mr-2 h-4 w-4" />
                Audit Logs
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Tasks', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/tasks")}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Tasks & Duties
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Panchayat Meetings', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/meetings")}>
                <Users className="mr-2 h-4 w-4" />
                Panchayat Meetings
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Complaints & Issues', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/complaints")}>
                <MessageSquareWarning className="mr-2 h-4 w-4" />
                Public Complaints
              </DropdownMenuItem>
            )}
          </>
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
