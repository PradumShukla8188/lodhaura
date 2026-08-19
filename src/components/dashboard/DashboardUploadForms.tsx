"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Image as ImageIcon, Video, Loader2, Plus } from "lucide-react";
import api from "@/lib/api";
import { getApiErrorMessage } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  featuredImage: z.string().optional(),
});

type BlogForm = z.infer<typeof blogSchema>;

export function DashboardUploadForms() {
  const [mode, setMode] = useState<"blog" | "image" | "video" | null>(null);
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");

  const blogForm = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", content: "", featuredImage: "" },
  });

  const blogMutation = useMutation({
    mutationFn: (data: BlogForm) =>
      api.post("/blog", {
        title: data.title,
        content: data.content,
        featuredImage: data.featuredImage || undefined,
      }),
    onSuccess: () => {
      toast.success("Blog submitted! Admin will review before publishing.");
      blogForm.reset();
      setMode(null);
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to add blog.")),
  });

  const imageMutation = useMutation({
    mutationFn: async () => {
      if (!imageFile) throw new Error("Select an image");
      const form = new FormData();
      form.append("image", imageFile);
      form.append("caption", imageCaption);
      form.append("album", "community");
      return api.post("/images", form, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      toast.success("Photo uploaded successfully!");
      setImageFile(null);
      setImageCaption("");
      setMode(null);
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to upload image.")),
  });

  const videoMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile) throw new Error("Select a video");
      if (!videoTitle.trim()) throw new Error("Video title required");
      const form = new FormData();
      form.append("video", videoFile);
      form.append("title", videoTitle);
      form.append("description", videoDesc);
      return api.post("/videos", form, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      toast.success("Video uploaded! Pending admin approval.");
      setVideoFile(null);
      setVideoTitle("");
      setVideoDesc("");
      setMode(null);
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to upload video.")),
  });

  return (
    <Card className="glass border-white/20">
      <CardContent className="p-5 sm:p-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <Plus className="h-5 w-5 text-primary" />
          Add New Content
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Share blogs, photos and videos with the village community.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={mode === "blog" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setMode(mode === "blog" ? null : "blog")}
          >
            <FileText className="h-4 w-4" /> Add Blog
          </Button>
          <Button
            type="button"
            variant={mode === "image" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setMode(mode === "image" ? null : "image")}
          >
            <ImageIcon className="h-4 w-4" /> Upload Photo
          </Button>
          <Button
            type="button"
            variant={mode === "video" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setMode(mode === "video" ? null : "video")}
          >
            <Video className="h-4 w-4" /> Upload Video
          </Button>
        </div>

        {mode === "blog" && (
          <form
            className="mt-5 space-y-4 border-t border-border/50 pt-5"
            onSubmit={blogForm.handleSubmit((d) => blogMutation.mutate(d))}
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...blogForm.register("title")} error={blogForm.formState.errors.title?.message} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea rows={6} {...blogForm.register("content")} />
              {blogForm.formState.errors.content && (
                <p className="text-xs text-destructive">{blogForm.formState.errors.content.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Featured Image URL (optional)</Label>
              <Input placeholder="https://..." {...blogForm.register("featuredImage")} />
            </div>
            <Button type="submit" disabled={blogMutation.isPending}>
              {blogMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Blog"}
            </Button>
          </form>
        )}

        {mode === "image" && (
          <div className="mt-5 space-y-4 border-t border-border/50 pt-5">
            <div className="space-y-2">
              <Label>Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} placeholder="Describe this photo" />
            </div>
            <Button onClick={() => imageMutation.mutate()} disabled={imageMutation.isPending || !imageFile}>
              {imageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Photo"}
            </Button>
          </div>
        )}

        {mode === "video" && (
          <div className="mt-5 space-y-4 border-t border-border/50 pt-5">
            <div className="space-y-2">
              <Label>Video file</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={3} value={videoDesc} onChange={(e) => setVideoDesc(e.target.value)} />
            </div>
            <Button onClick={() => videoMutation.mutate()} disabled={videoMutation.isPending || !videoFile}>
              {videoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Video"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
