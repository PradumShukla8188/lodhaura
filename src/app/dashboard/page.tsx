"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User, FileText, Image as ImageIcon, Video, Settings, LogOut, Loader2,
  LayoutDashboard, BarChart, Download, Activity, IndianRupee, Map,
  MessageSquareWarning, CheckSquare, Users, Clock, CheckCircle, XCircle, ToggleRight, ToggleLeft
} from "lucide-react";
import type { RootState } from "@/store/store";
import { logout, updateUser } from "@/store/slices/authSlice";
import { profileApi, governanceApi, adminApi, type ProfileData } from "@/lib/api-services";
import { profileSchema, changePasswordSchema, type ProfileFormData, type ChangePasswordFormData } from "@/lib/auth-schemas";
import { normalizeUser, getApiErrorMessage } from "@/lib/auth-utils";
import { DashboardUploadForms } from "@/components/dashboard/DashboardUploadForms";
import { DashboardComplaints } from "@/components/dashboard/DashboardComplaints";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <Card className="group relative overflow-hidden glass border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
      <CardContent className="relative flex items-center gap-4 p-5">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-background to-muted shadow-inner ring-1 ring-white/10", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Use a simple state for tab initialization to avoid useSearchParams hydration mismatch
  const [activeTab, setActiveTab] = useState("overview");

  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
    // Grab the tab from URL query params manually after mount if it exists
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted) router.push("/login");
  }, [isAuthenticated, mounted, router]);

  // --- USER DATA ---
  const { data: profileRes, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-me"],
    queryFn: async () => (await profileApi.getMe()).data.data as ProfileData,
    enabled: isAuthenticated,
  });

  const { data: analyticsRes, isLoading: analyticsLoading } = useQuery({
    queryKey: ["governanceAnalytics"],
    queryFn: async () => (await governanceApi.getGovernanceAnalytics()).data,
    enabled: isAuthenticated && ((user as any)?.role === 'admin' || (user as any)?.role === 'government'),
  });

  // --- ADMIN DATA ---
  const isAdmin = user?.role === "admin";
  const { data: adminStats, isLoading: adminStatsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => (await adminApi.getDashboard()).data.data,
    enabled: isAdmin && activeTab === "admin-overview",
  });
  const { data: adminUsers, isLoading: adminUsersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await adminApi.getUsers()).data.data as any[],
    enabled: isAdmin && activeTab === "admin-users",
  });
  const { data: adminContent, isLoading: adminContentLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => (await adminApi.getContent()).data.data as any,
    enabled: isAdmin && activeTab === "admin-content",
  });
  const { data: adminPending, isLoading: adminPendingLoading } = useQuery({
    queryKey: ["admin-pending"],
    queryFn: async () => (await adminApi.getPending()).data.data as any,
    enabled: isAdmin && activeTab === "admin-approvals",
  });

  // --- MUTATIONS ---
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", phone: user?.phone || "", bio: user?.bio || "" },
  });
  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (profileRes?.user) {
      profileForm.reset({
        name: String(profileRes.user.name || ""),
        phone: String(profileRes.user.phone || ""),
        bio: String(profileRes.user.bio || ""),
      });
    }
  }, [profileRes, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (res) => {
      const updated = normalizeUser(res.data.data as Record<string, unknown>);
      dispatch(updateUser(updated));
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
      toast.success("Profile updated successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update profile.")),
  });

  const changePasswordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Password changed successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to change password.")),
  });

  const toggleUser = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update user.")),
  });

  const approveContent = useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) => adminApi.approveContent(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending", "admin-content"] });
      toast.success("Content approved.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to approve.")),
  });

  const updateStatus = useMutation({
    mutationFn: ({ type, id, status }: { type: string; id: string; status: string }) => adminApi.updateContentStatus(type, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content", "admin-pending"] });
      toast.success("Status updated.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update status.")),
  });

  const handleLogout = () => {
    localStorage.removeItem("lodhaura_token");
    dispatch(logout());
    router.push("/");
  };

  if (!mounted || !user) return null;

  const stats = profileRes?.stats || { blogs: 0, images: 0, videos: 0 };
  const isGovUser = user?.role === 'admin' || user?.role === 'government';
  const analytics = analyticsRes?.data;

  // Combine content for admin views
  const pendingItems = [
    ...(adminPending?.blogs || []).map((b: any) => ({ ...b, type: "blog" as const, label: b.title })),
    ...(adminPending?.news || []).map((n: any) => ({ ...n, type: "news" as const, label: n.title })),
    ...(adminPending?.events || []).map((e: any) => ({ ...e, type: "event" as const, label: e.title })),
    ...(adminPending?.localServices || []).map((l: any) => ({ ...l, type: "localService" as const, label: l.businessName })),
    ...(adminPending?.agricultureServices || []).map((a: any) => ({ ...a, type: "agricultureService" as const, label: a.providerName })),
  ];

  const allAdminContent = [
    ...(adminContent?.blogs || []).map((b: any) => ({ ...b, type: "blog" as const, label: b.title })),
    ...(adminContent?.images || []).map((i: any) => ({ ...i, type: "image" as const, label: i.caption || "Photo" })),
    ...(adminContent?.videos || []).map((v: any) => ({ ...v, type: "video" as const, label: v.title })),
  ];

  return (
    <>
      <section className="py-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={(val) => { setActiveTab(val); router.replace(`/dashboard?tab=${val}`, { scroll: false }) }}>
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* SIDEBAR */}
              <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
                
                {/* User Profile Summary */}
                <div className="relative overflow-hidden rounded-2xl glass-strong border-white/20 p-5 flex items-center gap-4 shadow-lg shadow-primary/5">
                  <Avatar size="lg" fallback={user.name[0]} src={user.avatar} className="h-14 w-14 border-2 border-white/20 bg-gradient-village text-white" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate text-sm">{user.name}</h3>
                    <Badge variant="secondary" className="mt-1 capitalize shadow-sm border-primary/20 bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                      {user.role}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sidebar Navigation */}
                <div className="rounded-2xl glass border-white/10 p-2 flex-1">
                  <TabsList className="flex flex-col h-auto w-full justify-start p-0 gap-1 bg-transparent">
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Personal</p>
                    {[
                      { id: "overview", icon: LayoutDashboard, label: "Overview" },
                      { id: "blogs", icon: FileText, label: "My Blogs" },
                      { id: "photos", icon: ImageIcon, label: "My Photos" },
                      { id: "videos", icon: Video, label: "My Videos" },
                      { id: "complaints", icon: MessageSquareWarning, label: "My Complaints" },
                      { id: "profile", icon: User, label: "Profile" },
                      { id: "settings", icon: Settings, label: "Settings" },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={cn(
                          "w-full justify-start rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent",
                          activeTab === tab.id
                            ? "bg-primary/15 text-primary shadow-sm border-primary/20"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <tab.icon className="mr-3 h-4 w-4" />
                        {tab.label}
                      </TabsTrigger>
                    ))}

                    {isAdmin && (
                      <>
                        <div className="my-2 h-px w-full bg-border/50" />
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary">Admin Control</p>
                        {[
                          { id: "admin-overview", icon: Activity, label: "Admin Dashboard" },
                          { id: "admin-users", icon: Users, label: "Manage Users" },
                          { id: "admin-content", icon: FileText, label: "Posts & Media" },
                          { id: "admin-approvals", icon: Clock, label: "Approvals" },
                          { id: "admin-settings", icon: Settings, label: "System Settings" },
                        ].map((tab) => (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className={cn(
                              "w-full justify-start rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent",
                              activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-md border-primary/20"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                          >
                            <tab.icon className="mr-3 h-4 w-4" />
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </>
                    )}
                  </TabsList>
                </div>
              </aside>

              {/* MAIN CONTENT AREA */}
              <main className="flex-1 min-w-0 flex flex-col">
                <div className="glass-strong rounded-2xl border border-white/20 p-6 sm:p-8 min-h-[600px] flex-1">
                  
                  {/* --- PERSONAL TABS --- */}
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back, {user.name}!</h2>
                      <p className="text-muted-foreground text-sm mb-8">Here's what's happening with your account today.</p>
                    </div>

                    {isGovUser && (
                      <div className="space-y-4 mb-10 pb-10 border-b border-white/10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <h3 className="text-xl font-bold tracking-tight">Governance Analytics</h3>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="gap-2 text-xs h-8" onClick={() => window.open(governanceApi.getExportUrl('projects'))}>
                              <Download className="h-3 w-3" /> Projects CSV
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-xs h-8" onClick={() => window.open(governanceApi.getExportUrl('transactions'))}>
                              <Download className="h-3 w-3" /> Financials CSV
                            </Button>
                          </div>
                        </div>

                        {analyticsLoading ? (
                          <div className="grid gap-4 sm:grid-cols-4"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
                        ) : (
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard label="Active Projects" value={analytics?.totalProjects || 0} icon={Map} color="text-blue-500" />
                            <StatCard label="Available Funds" value={(analytics?.totalBudget || 0) - (analytics?.totalSpent || 0)} icon={IndianRupee} color="text-green-500" />
                            <StatCard label="Pending Grievances" value={analytics?.activeComplaints || 0} icon={MessageSquareWarning} color="text-orange-500" />
                            <StatCard label="Pending Tasks" value={analytics?.pendingTasks || 0} icon={CheckSquare} color="text-purple-500" />
                          </div>
                        )}
                      </div>
                    )}

                    <DashboardUploadForms />
                    
                    <h3 className="text-lg font-bold tracking-tight mb-2 mt-8">Your Uploads</h3>
                    {profileLoading ? (
                      <div className="grid gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-3">
                        <StatCard label="Blogs Added" value={stats.blogs} icon={FileText} color="text-primary" />
                        <StatCard label="Photos Uploaded" value={stats.images} icon={ImageIcon} color="text-secondary" />
                        <StatCard label="Videos Uploaded" value={stats.videos} icon={Video} color="text-accent" />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="blogs" className="mt-0">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">My Blogs</h2>
                    <ContentList loading={profileLoading} icon={FileText} empty="No blogs yet. Share your stories!" items={(profileRes?.blogs || []).map((b) => ({ id: b._id, title: b.title, status: b.status || "pending", date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "" }))} />
                  </TabsContent>

                  <TabsContent value="photos" className="mt-0">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">My Photos</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {profileLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
                      {!profileLoading && (profileRes?.images?.length || 0) === 0 && (
                        <div className="col-span-full"><EmptyState message="No photos uploaded yet." icon={ImageIcon} /></div>
                      )}
                      {profileRes?.images?.map((img) => (
                        <Card key={img._id} className="group glass overflow-hidden border-white/20">
                          <div className="overflow-hidden">
                            <img src={img.url} alt={img.caption || "Photo"} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <CardContent className="p-3 relative bg-background/50 backdrop-blur-sm border-t border-white/10">
                            <p className="truncate text-sm font-medium">{img.caption || "Untitled"}</p>
                            <Badge variant="outline" className="mt-1 capitalize text-xs">{img.status || "active"}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="videos" className="mt-0">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">My Videos</h2>
                    <ContentList loading={profileLoading} icon={Video} empty="No videos uploaded yet." items={(profileRes?.videos || []).map((v) => ({ id: v._id, title: v.title, status: v.status || "pending", date: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "" }))} />
                  </TabsContent>

                  <TabsContent value="profile" className="mt-0">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Profile Details</h2>
                    <form onSubmit={profileForm.handleSubmit((d) => updateProfileMutation.mutate(d))} className="space-y-4 max-w-2xl">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input error={profileForm.formState.errors.name?.message} {...profileForm.register("name")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input placeholder="+91..." {...profileForm.register("phone")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea placeholder="Tell us about yourself..." rows={4} {...profileForm.register("bio")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user.email} disabled className="opacity-50" />
                      </div>
                      <Button type="submit" disabled={updateProfileMutation.isPending} className="mt-4">
                        {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Security Settings</h2>
                    <form onSubmit={passwordForm.handleSubmit((d) => changePasswordMutation.mutate(d))} className="space-y-4 max-w-xl">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <PasswordInput error={passwordForm.formState.errors.currentPassword?.message} {...passwordForm.register("currentPassword")} />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <PasswordInput error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register("newPassword")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <PasswordInput error={passwordForm.formState.errors.confirmPassword?.message} {...passwordForm.register("confirmPassword")} />
                      </div>
                      <Button type="submit" disabled={changePasswordMutation.isPending} className="mt-4">
                        {changePasswordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="complaints" className="mt-0">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">My Complaints</h2>
                    <DashboardComplaints />
                  </TabsContent>

                  {/* --- ADMIN TABS --- */}
                  {isAdmin && (
                    <>
                      <TabsContent value="admin-overview" className="mt-0 space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">System Overview</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {adminStatsLoading
                            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)
                            : [
                                { label: "Total Users", value: adminStats?.users ?? 0, icon: Users, color: "text-primary" },
                                { label: "Blog Posts", value: adminStats?.blogs ?? 0, icon: FileText, color: "text-secondary" },
                                { label: "Pending Reports", value: adminStats?.pendingReports ?? 0, icon: Clock, color: "text-accent" },
                                { label: "New Contacts", value: adminStats?.newContacts ?? 0, icon: Settings, color: "text-primary" },
                              ].map((s) => <StatCard key={s.label} {...s} />)}
                        </div>
                      </TabsContent>

                      <TabsContent value="admin-users" className="mt-0">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">User Management</h2>
                        <div className="space-y-3">
                          {adminUsersLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                          {adminUsers?.map((u: any) => (
                            <Card key={u._id} className="glass border-white/20 transition-all hover:bg-white/5">
                              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                                <div>
                                  <p className="font-semibold">{u.name}</p>
                                  <p className="text-sm text-muted-foreground">{u.email}</p>
                                  <div className="mt-2 flex gap-2">
                                    <Badge variant="outline" className="capitalize">{u.roleId?.displayValue || u.roleId?.name || "User"}</Badge>
                                    <Badge variant={u.status === "active" ? "secondary" : "outline"} className="capitalize">{u.status}</Badge>
                                  </div>
                                </div>
                                <Button size="sm" variant={u.status === "active" ? "outline" : "default"} className="gap-2" disabled={toggleUser.isPending} onClick={() => toggleUser.mutate(u._id)}>
                                  {u.status === "active" ? <><ToggleRight className="h-4 w-4" />Disable</> : <><ToggleLeft className="h-4 w-4" />Enable</>}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="admin-content" className="mt-0">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">Posts & Media</h2>
                        <div className="space-y-3">
                          {adminContentLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                          {allAdminContent.map((item) => (
                            <Card key={`${item.type}-${item._id}`} className="glass border-white/20 hover:bg-white/5">
                              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="capitalize">{item.type}</Badge>
                                    <span className="font-medium">{item.label}</span>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">By {item.userId?.name || "Unknown"} • {item.status}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" className="gap-1" disabled={approveContent.isPending} onClick={() => approveContent.mutate({ type: item.type, id: item._id })}>
                                    <CheckCircle className="h-4 w-4" />Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="gap-1" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ type: item.type, id: item._id, status: "inactive" })}>
                                    <XCircle className="h-4 w-4" />Disable
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {!adminContentLoading && allAdminContent.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground border border-dashed border-white/20 rounded-xl">No content found.</div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="admin-approvals" className="mt-0">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">Pending Approvals</h2>
                        <div className="space-y-3">
                          {adminPendingLoading && [1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                          {pendingItems.map((item) => (
                            <Card key={`${item.type}-${item._id}`} className="glass border-white/20 hover:bg-white/5">
                              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="capitalize text-[10px]">{item.type}</Badge>
                                    <span className="font-medium">{item.label}</span>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">By {item.userId?.name || "Unknown"}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="gap-1" onClick={() => approveContent.mutate({ type: item.type, id: item._id })}>
                                    <CheckCircle className="h-4 w-4" />Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => updateStatus.mutate({ type: item.type, id: item._id, status: (item.type === "localService" || item.type === "agricultureService") ? "rejected" : "inactive" })}>
                                    <XCircle className="h-4 w-4" />Reject
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {!adminPendingLoading && pendingItems.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground border border-dashed border-white/20 rounded-xl">No pending approvals.</div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="admin-settings" className="mt-0">
                        <h2 className="text-2xl font-bold tracking-tight mb-6">System Settings</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {[
                            { title: "Village Info", desc: "Name, location, contact details" },
                            { title: "Email (SMTP)", desc: "Password reset & notifications" },
                            { title: "Cloudinary", desc: "Image & video uploads" },
                            { title: "Donations", desc: "UPI / Razorpay integration" },
                          ].map((s) => (
                            <div key={s.title} className="rounded-xl border border-border/50 bg-muted/30 p-5 hover:border-primary/50 transition-colors cursor-pointer">
                              <p className="font-medium text-lg">{s.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </>
                  )}
                  
                </div>
              </main>
              
            </div>
          </Tabs>
          
        </div>
      </section>
    </>
  );
}

function ContentList({ loading, empty, items, icon: Icon = FileText }: { loading: boolean; empty: string; items: { id: string; title: string; status: string; date: string }[]; icon?: React.ElementType; }) {
  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;
  if (items.length === 0) return <EmptyState message={empty} icon={Icon} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="group glass overflow-hidden border-white/20 transition-all hover:bg-white/5">
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
              <div>
                <p className="font-semibold tracking-tight transition-colors group-hover:text-primary">{item.title}</p>
                <p className="text-xs font-medium text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <Badge variant={item.status === "approved" || item.status === "active" ? "secondary" : "outline"} className="capitalize">{item.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ message, icon: Icon = FileText }: { message: string, icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground/50"><Icon className="h-8 w-8" /></div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
