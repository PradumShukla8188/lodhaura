import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { governanceApi } from "@/lib/api-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquareWarning, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardComplaints() {
  const [search, setSearch] = useState("");

  const { data: complaintsData, isLoading } = useQuery({
    queryKey: ["my-complaints"],
    queryFn: async () => {
      const res = await governanceApi.getMyComplaints();
      return res.data.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Under Review": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Assigned": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "In Progress": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Resolved": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Closed": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredComplaints = complaintsData?.filter((c: any) => 
    c.subject.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Complaints</h2>
          <p className="text-muted-foreground">Track the status of your reported issues</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search complaints..." 
            className="pl-9 bg-background/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-16 glass rounded-xl border border-white/10">
          <MessageSquareWarning className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No complaints found</h3>
          <p className="text-muted-foreground">You haven't submitted any complaints yet, or none match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredComplaints.map((complaint: any) => (
            <Card key={complaint._id} className="glass border-white/10 overflow-hidden">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-lg">{complaint.subject}</h3>
                    <Badge variant="outline" className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">Category: {complaint.category}</p>
                  <p className="text-sm mt-2">{complaint.description}</p>
                </div>
                
                <div className="md:w-64 flex flex-col justify-center space-y-3 pl-0 md:pl-6 md:border-l border-white/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Reported On</p>
                    <p className="text-sm font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                  </div>
                  {complaint.assignedTo && (
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned To</p>
                      <p className="text-sm font-medium">{complaint.assignedTo.name}</p>
                    </div>
                  )}
                  {complaint.resolvedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Resolved On</p>
                      <p className="text-sm font-medium text-green-500">{new Date(complaint.resolvedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              {complaint.resolutionRemarks && (
                <div className="bg-muted/30 px-6 py-3 border-t border-white/5 text-sm">
                  <span className="font-semibold text-primary mr-2">Admin Remarks:</span>
                  <span className="text-muted-foreground">{complaint.resolutionRemarks}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
