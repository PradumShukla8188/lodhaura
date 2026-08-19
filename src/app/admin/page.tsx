"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users,
  FileText,
  Image as ImageIcon,
  Video,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  LayoutDashboard,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import type { RootState } from "@/store/store";
import { adminApi } from "@/lib/api-services";
import { getApiErrorMessage } from "@/lib/auth-utils";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  roleId?: { name?: string; displayValue?: string };
  createdAt?: string;
}

interface ContentItem {
  _id: string;
  title?: string;
  caption?: string;
  status?: string;
  userId?: { name?: string; email?: string };
  createdAt?: string;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") router.push("/login");
  }, [isAuthenticated, user, router]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => (await adminApi.getDashboard()).data.data,
    enabled: user?.role === "admin",
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await adminApi.getUsers()).data.data as AdminUser[],
    enabled: user?.role === "admin" && tab === "users",
  });

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => (await adminApi.getContent()).data.data as {
      blogs: ContentItem[];
      images: ContentItem[];
      videos: ContentItem[];
    },
    enabled: user?.role === "admin" && tab === "content",
  });

  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ["admin-pending"],
    queryFn: async () => (await adminApi.getPending()).data.data as {
      blogs: ContentItem[];
      news: ContentItem[];
      events: ContentItem[];
    },
    enabled: user?.role === "admin" && tab === "approvals",
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
    mutationFn: ({ type, id }: { type: string; id: string }) =>
      adminApi.approveContent(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending", "admin-content"] });
      toast.success("Content approved.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to approve.")),
  });

  const updateStatus = useMutation({
    mutationFn: ({ type, id, status }: { type: string; id: string; status: string }) =>
      adminApi.updateContentStatus(type, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content", "admin-pending"] });
      toast.success("Status updated.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to update status.")),
  });

  if (!user || user.role !== "admin") return null;

  const statCards = [
    { label: "Total Users", value: stats?.users ?? 0, icon: Users, color: "text-primary" },
    { label: "Blog Posts", value: stats?.blogs ?? 0, icon: FileText, color: "text-secondary" },
    { label: "Pending Reports", value: stats?.pendingReports ?? 0, icon: Clock, color: "text-accent" },
    { label: "New Contacts", value: stats?.newContacts ?? 0, icon: Settings, color: "text-primary" },
  ];

  const pendingItems = [
    ...(pending?.blogs || []).map((b) => ({ ...b, type: "blog" as const, label: b.title })),
    ...(pending?.news || []).map((n) => ({ ...n, type: "news" as const, label: n.title })),
    ...(pending?.events || []).map((e) => ({ ...e, type: "event" as const, label: e.title })),
  ];

  const allContent = [
    ...(content?.blogs || []).map((b) => ({ ...b, type: "blog" as const, label: b.title })),
    ...(content?.images || []).map((i) => ({ ...i, type: "image" as const, label: i.caption || "Photo" })),
    ...(content?.videos || []).map((v) => ({ ...v, type: "video" as const, label: v.title })),
  ];

  return (
    <>
      <PageHeader
        title="Admin Panel"
        subtitle="Manage users, content, approvals and website settings"
        badge="Administrator"
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
            <TabsList className="mb-8 flex h-auto flex-wrap gap-1">
              <TabsTrigger value="overview"><LayoutDashboard className="mr-1.5 h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="users"><Users className="mr-1.5 h-4 w-4" />Users</TabsTrigger>
              <TabsTrigger value="content"><FileText className="mr-1.5 h-4 w-4" />Posts & Media</TabsTrigger>
              <TabsTrigger value="approvals"><Clock className="mr-1.5 h-4 w-4" />Approvals</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="mr-1.5 h-4 w-4" />Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statsLoading
                  ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)
                  : statCards.map((s) => (
                      <Card key={s.label} className="glass border-white/20">
                        <CardContent className="flex items-center gap-4 p-5">
                          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-muted", s.color)}>
                            <s.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-3">
                {usersLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                {users?.map((u) => (
                  <Card key={u._id} className="glass border-white/20">
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline" className="capitalize">
                            {u.roleId?.displayValue || u.roleId?.name || "User"}
                          </Badge>
                          <Badge variant={u.status === "active" ? "secondary" : "outline"} className="capitalize">
                            {u.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={u.status === "active" ? "outline" : "default"}
                        className="gap-2"
                        disabled={toggleUser.isPending}
                        onClick={() => toggleUser.mutate(u._id)}
                      >
                        {u.status === "active" ? (
                          <><ToggleRight className="h-4 w-4" />Disable</>
                        ) : (
                          <><ToggleLeft className="h-4 w-4" />Enable</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="space-y-3">
                {contentLoading && [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                {allContent.map((item) => (
                  <Card key={`${item.type}-${item._id}`} className="glass border-white/20">
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{item.type}</Badge>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          By {item.userId?.name || "Unknown"} • {item.status}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className="gap-1"
                          disabled={approveContent.isPending}
                          onClick={() => approveContent.mutate({ type: item.type, id: item._id })}
                        >
                          <CheckCircle className="h-4 w-4" />Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              type: item.type,
                              id: item._id,
                              status: item.type === "image" ? "inactive" : "inactive",
                            })
                          }
                        >
                          <XCircle className="h-4 w-4" />Disable
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!contentLoading && allContent.length === 0 && (
                  <Card className="glass border-white/20">
                    <CardContent className="py-12 text-center text-muted-foreground">No content found.</CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="approvals">
              <div className="space-y-3">
                {pendingLoading && [1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                {pendingItems.map((item) => (
                  <Card key={`${item.type}-${item._id}`} className="glass border-white/20">
                    <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{item.type}</Badge>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          By {item.userId?.name || "Unknown"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => approveContent.mutate({ type: item.type, id: item._id })}
                        >
                          <CheckCircle className="h-4 w-4" />Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-destructive"
                          onClick={() =>
                            updateStatus.mutate({ type: item.type, id: item._id, status: "inactive" })
                          }
                        >
                          <XCircle className="h-4 w-4" />Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!pendingLoading && pendingItems.length === 0 && (
                  <Card className="glass border-white/20">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      No pending approvals.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="glass border-white/20">
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-lg font-semibold">Website Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage village portal configuration. Connect Cloudinary, SMTP, and payment keys via backend environment variables.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Village Info", desc: "Name, location, contact details" },
                      { title: "Email (SMTP)", desc: "Password reset & notifications" },
                      { title: "Cloudinary", desc: "Image & video uploads" },
                      { title: "Donations", desc: "UPI / Razorpay integration" },
                    ].map((s) => (
                      <div key={s.title} className="rounded-xl border border-border/50 bg-muted/30 p-4">
                        <p className="font-medium">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
