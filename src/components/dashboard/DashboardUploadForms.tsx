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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
  const [blogImageMode, setBlogImageMode] = useState<"link" | "upload">("link");
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageCaption, setImageCaption] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");

  const blogForm = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", content: "", featuredImage: "" },
  });

  const blogMutation = useMutation({
    mutationFn: async (data: BlogForm) => {
      let featuredImage = data.featuredImage || undefined;
      
      if (blogImageMode === "upload" && blogImageFile) {
        setIsUploadingImage(true);
        try {
          const form = new FormData();
          form.append("image", blogImageFile);
          form.append("caption", data.title);
          form.append("album", "community");
          const res = await api.post("/images", form, { headers: { "Content-Type": "multipart/form-data" } });
          featuredImage = res.data.data.url;
        } finally {
          setIsUploadingImage(false);
        }
      }

      return api.post("/blog", {
        title: data.title,
        content: data.content,
        featuredImage,
      });
    },
    onSuccess: () => {
      toast.success("Blog submitted! Admin will review before publishing.");
      blogForm.reset();
      setBlogImageFile(null);
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
      <CardContent className="p-6 sm:p-8">
        <div className="mb-2">
          <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            Create New Content
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your village stories, photos, and videos with the community.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setMode(mode === "blog" ? null : "blog")}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg",
              mode === "blog" 
                ? "border-primary bg-primary/5 text-primary shadow-md ring-1 ring-primary/20" 
                : "border-border/50 bg-muted/10 text-muted-foreground hover:border-primary/30 hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className={cn("rounded-full p-3 transition-colors", mode === "blog" ? "bg-primary/20" : "bg-background group-hover:bg-primary/10 group-hover:text-primary")}>
              <FileText className="h-6 w-6" />
            </div>
            <span className="font-semibold">Write a Blog</span>
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "image" ? null : "image")}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg",
              mode === "image" 
                ? "border-secondary bg-secondary/5 text-secondary shadow-md ring-1 ring-secondary/20" 
                : "border-border/50 bg-muted/10 text-muted-foreground hover:border-secondary/30 hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className={cn("rounded-full p-3 transition-colors", mode === "image" ? "bg-secondary/20" : "bg-background group-hover:bg-secondary/10 group-hover:text-secondary")}>
              <ImageIcon className="h-6 w-6" />
            </div>
            <span className="font-semibold">Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "video" ? null : "video")}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg",
              mode === "video" 
                ? "border-accent bg-accent/5 text-accent shadow-md ring-1 ring-accent/20" 
                : "border-border/50 bg-muted/10 text-muted-foreground hover:border-accent/30 hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className={cn("rounded-full p-3 transition-colors", mode === "video" ? "bg-accent/20" : "bg-background group-hover:bg-accent/10 group-hover:text-accent")}>
              <Video className="h-6 w-6" />
            </div>
            <span className="font-semibold">Upload Video</span>
          </button>
        </div>

        {mode === "blog" && (
          <form
            className="mt-6 space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-inner"
            onSubmit={blogForm.handleSubmit((d) => blogMutation.mutate(d))}
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...blogForm.register("title")} error={blogForm.formState.errors.title?.message} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Controller
                control={blogForm.control}
                name="content"
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {blogForm.formState.errors.content && (
                <p className="text-xs text-destructive">{blogForm.formState.errors.content.message}</p>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Featured Image (optional)</Label>
                <div className="flex rounded-md border border-input p-1">
                  <button
                    type="button"
                    onClick={() => setBlogImageMode("link")}
                    className={cn("rounded px-3 py-1 text-xs font-medium transition-colors", blogImageMode === "link" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    Use Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogImageMode("upload")}
                    className={cn("rounded px-3 py-1 text-xs font-medium transition-colors", blogImageMode === "upload" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    Upload File
                  </button>
                </div>
              </div>
              
              {blogImageMode === "link" ? (
                <Input placeholder="https://..." {...blogForm.register("featuredImage")} />
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBlogImageFile(e.target.files?.[0] || null)}
                  />
                  {blogImageFile && (
                    <p className="text-xs text-muted-foreground">Selected: {blogImageFile.name}</p>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={blogMutation.isPending || isUploadingImage}>
              {(blogMutation.isPending || isUploadingImage) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploadingImage ? "Uploading Image..." : "Publishing..."}
                </>
              ) : (
                "Publish Blog"
              )}
            </Button>
          </form>
        )}

        {mode === "image" && (
          <div className="mt-6 space-y-4 rounded-xl border border-secondary/20 bg-secondary/5 p-5 shadow-inner">
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
          <div className="mt-6 space-y-4 rounded-xl border border-accent/20 bg-accent/5 p-5 shadow-inner">
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
