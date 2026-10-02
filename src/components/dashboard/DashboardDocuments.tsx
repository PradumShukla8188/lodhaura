"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { residentApi } from "@/lib/api-services";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

export function DashboardDocuments() {
  const queryClient = useQueryClient();
  
  const { data: resData, isLoading } = useQuery({
    queryKey: ["resident-documents"],
    queryFn: async () => (await residentApi.getDocuments()).data,
  });

  const updateStatus = useMutation({
    mutationFn: residentApi.updateDocumentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident-documents"] });
      toast.success("Document status updated!");
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const documents = resData?.data || [];
  
  const total = documents.length;
  const available = documents.filter((d: any) => d.status === "Have Document").length;
  const pending = documents.filter((d: any) => d.status === "Pending" || d.status === "Needs Renewal/Correction").length;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Have Document": return <Badge variant="secondary" className="bg-green-500/10 text-green-500"><CheckCircle className="mr-1 w-3 h-3"/> Have It</Badge>;
      case "Applied": return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500"><Clock className="mr-1 w-3 h-3"/> Applied</Badge>;
      case "Pending": return <Badge variant="destructive"><AlertCircle className="mr-1 w-3 h-3"/> Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="glass"><CardContent className="p-4 flex flex-col items-center"><p className="text-sm text-muted-foreground">Total Docs</p><p className="text-2xl font-bold">{total}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 flex flex-col items-center"><p className="text-sm text-muted-foreground">Available</p><p className="text-2xl font-bold text-green-500">{available}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 flex flex-col items-center"><p className="text-sm text-muted-foreground">Action Needed</p><p className="text-2xl font-bold text-red-500">{pending}</p></CardContent></Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Document Checklist</h3>
        {documents.map((doc: any) => (
          <Card key={doc.template._id} className="glass">
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> {doc.template.name}
                  {getStatusBadge(doc.status)}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{doc.template.purpose}</p>
                {doc.template.officialLink && (
                  <a href={doc.template.officialLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-2 inline-block">
                    Official Application Link
                  </a>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {doc.status !== "Have Document" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ templateId: doc.template._id, status: "Have Document" })}>
                    Mark as Available
                  </Button>
                )}
                {doc.status === "Pending" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ templateId: doc.template._id, status: "Applied" })}>
                    Mark Applied
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {documents.length === 0 && (
          <div className="text-center p-8 border border-dashed border-white/20 rounded-xl">
            <p className="text-muted-foreground">No documents configured by admin yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
