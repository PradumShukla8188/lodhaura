"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Plus, Loader2, Trash2, Download, Eye, ExternalLink } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const DOCUMENT_TYPES = [
  'Government Order', 'Panchayat Document', 'Project Document',
  'Fund Document', 'Meeting Minutes', 'Scheme Document',
  'Report', 'Certificate', 'Development Photo', 'Other'
];

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", documentType: "Government Order", url: "", visibility: "Internal", verificationStatus: "Unverified" 
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await governanceApi.getDocuments();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setIsCreating(false);
      setFormData({ title: "", documentType: "Government Order", url: "", visibility: "Internal", verificationStatus: "Unverified" });
      toast.success("Document uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload document");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const documents = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Village Documents" 
          subtitle="Centralized repository for government orders, reports, and official records." 
        />
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Document Title *</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Document Type *</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.documentType}
                    onChange={e => setFormData({...formData, documentType: e.target.value})}
                    required
                  >
                    {DOCUMENT_TYPES.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>File URL (Cloudinary / Storage Link) *</Label>
                  <Input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://" required />
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.visibility}
                    onChange={e => setFormData({...formData, visibility: e.target.value})}
                  >
                    <option value="Internal">Internal (Staff Only)</option>
                    <option value="Public">Public (Visible to Citizens)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Document"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc: any) => (
            <Card key={doc._id} className="glass hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-base truncate pr-4">{doc.title}</h3>
                    <Badge variant="outline" className={doc.visibility === 'Public' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted text-muted-foreground'}>
                      {doc.visibility}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{doc.documentType} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">Uploaded by {doc.uploadedBy?.name}</p>
                  
                  <div className="flex gap-2 pt-3">
                    <Button variant="secondary" size="sm" className="h-7 text-xs gap-1" onClick={() => window.open(doc.url, "_blank")}>
                      <ExternalLink className="h-3 w-3" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:bg-destructive/10" onClick={() => { if(confirm("Delete this document?")) deleteMutation.mutate(doc._id); }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {documents.length === 0 && !isCreating && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-xl glass">
              No documents found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
