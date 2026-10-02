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
  CalendarDays,
  Briefcase,
  Wrench,
  Store,
  Tractor,
  Info,
  Phone,
  Settings
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

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Worker Services
        </div>
        <DropdownMenuItem onClick={() => router.push("/dashboard/worker-profile")}>
          <Briefcase className="mr-2 h-4 w-4" />
          Become a Worker / Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/worker-requests")}>
          <Wrench className="mr-2 h-4 w-4" />
          Jobs & Requests
        </DropdownMenuItem>
        {(user.role === "admin" || user.role === "super_admin") && (
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
              <DropdownMenuItem onClick={() => router.push("/dashboard/users")}>
                <User className="mr-2 h-4 w-4" />
                All Users
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

            {(hasPermission(user as any, 'Village Information', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/village-info")}>
                <Info className="mr-2 h-4 w-4" />
                Village Information
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Local Services', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/local-services")}>
                <Store className="mr-2 h-4 w-4" />
                Local Services
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Agriculture Services', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/agriculture-services")}>
                <Tractor className="mr-2 h-4 w-4" />
                Agriculture Services
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Jobs', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/jobs")}>
                <Briefcase className="mr-2 h-4 w-4" />
                Jobs & Applications
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Marketplace', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/marketplace")}>
                <Store className="mr-2 h-4 w-4" />
                Marketplace Listings
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Emergency Contacts', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/emergency-contacts")}>
                <Phone className="mr-2 h-4 w-4" />
                Emergency Contacts
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Residents', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/residents")}>
                <Users className="mr-2 h-4 w-4" />
                Residents
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Workers', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/workers")}>
                <Briefcase className="mr-2 h-4 w-4" />
                Workers
              </DropdownMenuItem>
            )}

            {(hasPermission(user as any, 'Website Settings', 'View') || user.role === 'admin') && (
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Website Settings
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
