"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  FileText,
  Image as ImageIcon,
  Video,
  Settings,
  LogOut,
  Loader2,
  LayoutDashboard,
  BarChart,
  Download,
  Activity,
  IndianRupee,
  Map,
  MessageSquareWarning,
  CheckSquare
} from "lucide-react";
import type { RootState } from "@/store/store";
import { logout, updateUser } from "@/store/slices/authSlice";
import { profileApi, governanceApi, type ProfileData } from "@/lib/api-services";
import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormData,
  type ChangePasswordFormData,
} from "@/lib/auth-schemas";
import { normalizeUser, getApiErrorMessage } from "@/lib/auth-utils";
import { DashboardUploadForms } from "@/components/dashboard/DashboardUploadForms";
import { PageHeader } from "@/components/PageHeader";
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

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["profile-me"],
    queryFn: async () => {
      const res = await profileApi.getMe();
      return res.data.data as ProfileData;
    },
    enabled: isAuthenticated,
  });

  const { data: analyticsRes, isLoading: analyticsLoading } = useQuery({
    queryKey: ["governanceAnalytics"],
    queryFn: async () => (await governanceApi.getGovernanceAnalytics()).data,
    enabled: isAuthenticated && ((user as any)?.role === 'admin' || (user as any)?.role === 'government'),
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", phone: user?.phone || "", bio: user?.bio || "" },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (data?.user) {
      profileForm.reset({
        name: String(data.user.name || ""),
        phone: String(data.user.phone || ""),
        bio: String(data.user.bio || ""),
      });
    }
  }, [data, profileForm]);

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

  const handleLogout = () => {
    localStorage.removeItem("lodhaura_token");
    dispatch(logout());
    router.push("/");
  };

  if (!mounted || !user) return null;

  const stats = data?.stats || { blogs: 0, images: 0, videos: 0 };
  const isGovUser = (user as any)?.role === 'admin' || (user as any)?.role === 'government';
  const analytics = analyticsRes?.data;

  return (
    <>
      <PageHeader
        title="My Dashboard"
        subtitle="Manage your profile, blogs, photos and videos"
        badge="Member Panel"
      />
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Profile header */}
          {/* Profile header */}
          <div className="relative mb-8 overflow-hidden rounded-2xl glass-strong border-white/20 p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-village blur opacity-50" />
                  <Avatar
                    size="lg"
                    fallback={user.name[0]}
                    src={user.avatar}
                    className="relative h-24 w-24 border-2 border-white/50 dark:border-white/10 text-3xl shadow-xl bg-gradient-village text-white"
                  />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{user.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-3 capitalize shadow-sm border-primary/20 bg-primary/10 text-primary">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="gap-2 self-start sm:self-center shadow-lg transition-transform hover:scale-105" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 flex h-auto flex-wrap gap-2 bg-transparent p-0">
              {[
                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                { id: "blogs", icon: FileText, label: "My Blogs" },
                { id: "photos", icon: ImageIcon, label: "My Photos" },
                { id: "videos", icon: Video, label: "My Videos" },
                { id: "profile", icon: User, label: "Profile" },
                { id: "settings", icon: Settings, label: "Settings" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    "data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-primary/20",
                    "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-white/5 data-[state=inactive]:hover:text-foreground"
                  )}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                
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
                        <Button variant="outline" size="sm" className="gap-2 text-xs h-8" onClick={() => window.open(governanceApi.getExportUrl('complaints'))}>
                          <Download className="h-3 w-3" /> Grievances CSV
                        </Button>
                      </div>
                    </div>

                    {analyticsLoading ? (
                      <div className="grid gap-4 sm:grid-cols-4"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-24 rounded-xl" /></div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Active Projects" value={analytics?.totalProjects || 0} icon={Map} color="text-blue-500" />
                        <StatCard label="Available Funds (₹)" value={(analytics?.totalBudget || 0) - (analytics?.totalSpent || 0)} icon={IndianRupee} color="text-green-500" />
                        <StatCard label="Pending Grievances" value={analytics?.activeComplaints || 0} icon={MessageSquareWarning} color="text-orange-500" />
                        <StatCard label="Pending Tasks" value={analytics?.pendingTasks || 0} icon={CheckSquare} color="text-purple-500" />
                      </div>
                    )}
                  </div>
                )}

                <DashboardUploadForms />
                
                <h3 className="text-lg font-bold tracking-tight mb-2">My Uploads</h3>
                {isLoading ? (
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
              </div>
            </TabsContent>

            <TabsContent value="blogs">
              <ContentList
                loading={isLoading}
                icon={FileText}
                empty="No blogs yet. Share your village stories!"
                items={(data?.blogs || []).map((b) => ({
                  id: b._id,
                  title: b.title,
                  status: b.status || "pending",
                  date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "",
                }))}
              />
            </TabsContent>

            <TabsContent value="photos">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
                {!isLoading && (data?.images?.length || 0) === 0 && (
                  <div className="col-span-full">
                    <EmptyState message="No photos uploaded yet." icon={ImageIcon} />
                  </div>
                )}
                {data?.images?.map((img) => (
                  <Card key={img._id} className="group glass overflow-hidden border-white/20">
                    <div className="overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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

            <TabsContent value="videos">
              <ContentList
                loading={isLoading}
                icon={Video}
                empty="No videos uploaded yet."
                items={(data?.videos || []).map((v) => ({
                  id: v._id,
                  title: v.title,
                  status: v.status || "pending",
                  date: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "",
                }))}
              />
            </TabsContent>

            <TabsContent value="profile">
              <Card className="glass border-white/20">
                <CardContent className="space-y-4 p-6">
                  <form
                    onSubmit={profileForm.handleSubmit((d) => updateProfileMutation.mutate(d))}
                    className="space-y-4"
                  >
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
                      <Input value={user.email} disabled />
                    </div>
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="glass border-white/20">
                <CardContent className="space-y-4 p-6">
                  <h3 className="font-semibold">Change Password</h3>
                  <form
                    onSubmit={passwordForm.handleSubmit((d) => changePasswordMutation.mutate(d))}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <PasswordInput
                        error={passwordForm.formState.errors.currentPassword?.message}
                        {...passwordForm.register("currentPassword")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <PasswordInput
                        error={passwordForm.formState.errors.newPassword?.message}
                        {...passwordForm.register("newPassword")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <PasswordInput
                        error={passwordForm.formState.errors.confirmPassword?.message}
                        {...passwordForm.register("confirmPassword")}
                      />
                    </div>
                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                      {changePasswordMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}

function ContentList({
  loading,
  empty,
  items,
  icon: Icon = FileText,
}: {
  loading: boolean;
  empty: string;
  items: { id: string; title: string; status: string; date: string }[];
  icon?: React.ElementType;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }
  if (items.length === 0) return <EmptyState message={empty} icon={Icon} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="group glass overflow-hidden border-white/20 transition-all hover:bg-white/5">
          <CardContent className="flex items-center justify-between p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold tracking-tight transition-colors group-hover:text-primary">{item.title}</p>
                <p className="text-xs font-medium text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <Badge variant={item.status === "approved" || item.status === "active" ? "secondary" : "outline"} className="capitalize">
              {item.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ message, icon: Icon = FileText }: { message: string, icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
        <Icon className="h-8 w-8" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
