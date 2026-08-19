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
} from "lucide-react";
import type { RootState } from "@/store/store";
import { logout, updateUser } from "@/store/slices/authSlice";
import { profileApi, type ProfileData } from "@/lib/api-services";
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
    <Card className="glass border-white/20">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-muted", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading } = useQuery({
    queryKey: ["profile-me"],
    queryFn: async () => {
      const res = await profileApi.getMe();
      return res.data.data as ProfileData;
    },
    enabled: isAuthenticated,
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

  if (!user) return null;

  const stats = data?.stats || { blogs: 0, images: 0, videos: 0 };

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
          <Card className="glass-strong mb-8 overflow-hidden border-white/20">
            <div className="h-24 bg-gradient-village opacity-90" />
            <CardContent className="relative px-6 pb-6">
              <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  <Avatar
                    size="lg"
                    fallback={user.name[0]}
                    src={user.avatar}
                    className="h-24 w-24 border-4 border-background bg-gradient-village text-3xl text-white"
                  />
                  <div className="pb-1">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge className="mt-2 capitalize">{user.role}</Badge>
                  </div>
                </div>
                <Button variant="outline" className="gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
              <TabsTrigger value="overview"><LayoutDashboard className="mr-1.5 h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="blogs"><FileText className="mr-1.5 h-4 w-4" />My Blogs</TabsTrigger>
              <TabsTrigger value="photos"><ImageIcon className="mr-1.5 h-4 w-4" />My Photos</TabsTrigger>
              <TabsTrigger value="videos"><Video className="mr-1.5 h-4 w-4" />My Videos</TabsTrigger>
              <TabsTrigger value="profile"><User className="mr-1.5 h-4 w-4" />Profile</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="mr-1.5 h-4 w-4" />Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <DashboardUploadForms />
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
                  <EmptyState message="No photos uploaded yet." />
                )}
                {data?.images?.map((img) => (
                  <Card key={img._id} className="glass overflow-hidden border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption || "Photo"} className="aspect-square w-full object-cover" />
                    <CardContent className="p-3">
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
}: {
  loading: boolean;
  empty: string;
  items: { id: string; title: string; status: string; date: string }[];
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
    );
  }
  if (items.length === 0) return <EmptyState message={empty} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="glass border-white/20">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
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

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="glass border-white/20">
      <CardContent className="py-12 text-center text-muted-foreground">{message}</CardContent>
    </Card>
  );
}
