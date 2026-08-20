"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Edit, CheckCircle, Loader2, IndianRupee, MapPin, Calendar, Clock, Plus } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [progressData, setProgressData] = useState({ progressPercentage: 0, description: "", workCompleted: "", workRemaining: "" });
  const [transactionData, setTransactionData] = useState({ transactionType: "Fund Released", amount: "", description: "", referenceNumber: "" });

  const { data: projectRes, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => (await governanceApi.getProjectById(id as string)).data,
  });

  const { data: historyRes, isLoading: historyLoading } = useQuery({
    queryKey: ["projectProgress", id],
    queryFn: async () => (await governanceApi.getProjectProgress(id as string)).data,
  });

  const { data: transactionsRes } = useQuery({
    queryKey: ["projectTransactions", id],
    queryFn: async () => (await governanceApi.getProjectTransactions(id as string)).data,
  });

  const addProgressMutation = useMutation({
    mutationFn: (data: any) => governanceApi.addProjectProgress(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projectProgress", id] });
      setIsUpdatingProgress(false);
      setProgressData({ progressPercentage: 0, description: "", workCompleted: "", workRemaining: "" });
      toast.success("Progress updated successfully");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to update progress"),
  });

  const addTransactionMutation = useMutation({
    mutationFn: (data: any) => governanceApi.createTransaction({ project: id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projectTransactions", id] });
      setIsAddingTransaction(false);
      setTransactionData({ transactionType: "Fund Released", amount: "", description: "", referenceNumber: "" });
      toast.success("Transaction recorded successfully");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to record transaction"),
  });

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressMutation.mutate(progressData);
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransactionMutation.mutate(transactionData);
  };

  const project = projectRes?.data;
  const history = historyRes?.data || [];
  const transactions = transactionsRes?.data || [];

  if (projectLoading) return <div className="flex justify-center p-24"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!project) return <div className="text-center p-24">Project not found</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 mt-16">
      <Button variant="ghost" onClick={() => router.push("/dashboard/projects")} className="gap-2 -ml-4">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline" className={project.progressPercentage === 100 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-primary/10 text-primary border-primary/20"}>
              {project.status}
            </Badge>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
              {project.priority} Priority
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-3xl">{project.description}</p>
        </div>
        <Button onClick={() => setIsUpdatingProgress(true)} className="gap-2 shrink-0">
          <Edit className="h-4 w-4" /> Update Progress
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">Overall Progress</span>
                <span className="font-bold">{project.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-4 border border-white/5 overflow-hidden">
                <div 
                  className={`h-4 transition-all duration-1000 ease-out ${project.progressPercentage === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                  style={{ width: `${project.progressPercentage || 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {isUpdatingProgress && (
            <Card className="glass border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <CardHeader>
                <CardTitle>Log Progress Update</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProgressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>New Progress Percentage (0-100)</Label>
                      <Input type="number" min="0" max="100" value={progressData.progressPercentage} onChange={e => setProgressData({...progressData, progressPercentage: Number(e.target.value)})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Overall Status Description *</Label>
                    <Textarea value={progressData.description} onChange={e => setProgressData({...progressData, description: e.target.value})} placeholder="What is the current status of the project?" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Work Completed (Since last update)</Label>
                      <Textarea value={progressData.workCompleted} onChange={e => setProgressData({...progressData, workCompleted: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Work Remaining</Label>
                      <Textarea value={progressData.workRemaining} onChange={e => setProgressData({...progressData, workRemaining: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsUpdatingProgress(false)}>Cancel</Button>
                    <Button type="submit" disabled={addProgressMutation.isPending}>
                      {addProgressMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Update"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview">
            <TabsList className="bg-background/50 border border-white/5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Progress History ({history.length})</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card className="glass border-white/20">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b border-white/10 pb-2">Project Details</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="col-span-2 font-medium">{project.department?.name || "-"}</span>
                      <span className="text-muted-foreground">Scheme:</span>
                      <span className="col-span-2 font-medium">{project.scheme?.title || "-"}</span>
                      <span className="text-muted-foreground">Category:</span>
                      <span className="col-span-2 font-medium">{project.category || "-"}</span>
                      <span className="text-muted-foreground">Officer:</span>
                      <span className="col-span-2 font-medium">{project.assignedOfficer?.name || "-"}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b border-white/10 pb-2">Location & Schedule</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Village:</span>
                      <span className="col-span-2 font-medium">{project.village || "-"}</span>
                      <span className="text-muted-foreground">Ward:</span>
                      <span className="col-span-2 font-medium">{project.ward || "-"}</span>
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="col-span-2 font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}</span>
                      <span className="text-muted-foreground">Expected End:</span>
                      <span className="col-span-2 font-medium">{project.expectedCompletionDate ? new Date(project.expectedCompletionDate).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4 space-y-4">
              {historyLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : history.length === 0 ? (
                <Card className="glass border-white/20"><CardContent className="p-12 text-center text-muted-foreground">No progress updates logged yet.</CardContent></Card>
              ) : (
                <div className="relative border-l border-white/10 ml-3 md:ml-4 space-y-8 py-4">
                  {history.map((log: any, idx: number) => (
                    <div key={log._id} className="relative pl-6 md:pl-8">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 ring-4 ring-background" />
                      <div className="glass border border-white/10 rounded-xl p-5 space-y-3">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <span className="font-semibold text-lg">{log.progressPercentage}% Completed</span>
                            <p className="text-sm text-muted-foreground">Updated by {log.updatedBy?.name} on {new Date(log.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-sm">{log.description}</p>
                        {(log.workCompleted || log.workRemaining) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-3 bg-background/50 rounded-lg text-sm border border-white/5">
                            {log.workCompleted && <div><span className="font-semibold text-green-500 mb-1 flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Completed</span><p>{log.workCompleted}</p></div>}
                            {log.workRemaining && <div><span className="font-semibold text-orange-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3"/> Remaining</span><p>{log.workRemaining}</p></div>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="financials" className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Financial Overview</h3>
                <Button onClick={() => setIsAddingTransaction(!isAddingTransaction)} size="sm" variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Transaction
                </Button>
              </div>

              {isAddingTransaction && (
                <Card className="glass border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <CardContent className="p-6">
                    <form onSubmit={handleTransactionSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Transaction Type</Label>
                          <select 
                            className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                            value={transactionData.transactionType}
                            onChange={e => setTransactionData({...transactionData, transactionType: e.target.value})}
                          >
                            <option value="Fund Sanctioned">Fund Sanctioned (Increases Budget)</option>
                            <option value="Fund Released">Fund Released (Increases Available)</option>
                            <option value="Fund Received">Fund Received (Increases Available)</option>
                            <option value="Expense">Expense (Increases Spent)</option>
                            <option value="Payment">Payment (Increases Spent)</option>
                            <option value="Adjustment">Adjustment (Corrects Errors)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount (₹)</Label>
                          <Input type="number" value={transactionData.amount} onChange={e => setTransactionData({...transactionData, amount: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input value={transactionData.description} onChange={e => setTransactionData({...transactionData, description: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Reference Number (Optional)</Label>
                          <Input value={transactionData.referenceNumber} onChange={e => setTransactionData({...transactionData, referenceNumber: e.target.value})} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsAddingTransaction(false)}>Cancel</Button>
                        <Button type="submit" disabled={addTransactionMutation.isPending}>
                          {addTransactionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Transaction"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-background/40 rounded-xl border border-white/5 space-y-1">
                      <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3 w-3"/> Approved Budget</p>
                      <p className="text-2xl font-bold">₹{project.approvedBudget?.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-4 bg-background/40 rounded-xl border border-white/5 space-y-1">
                      <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3 w-3"/> Total Spent</p>
                      <p className="text-2xl font-bold text-orange-500">₹{project.spentAmount?.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 space-y-1">
                      <p className="text-xs font-semibold uppercase text-primary flex items-center gap-1"><IndianRupee className="h-3 w-3"/> Remaining Fund</p>
                      <p className="text-2xl font-bold text-primary">₹{((project.releasedFund || 0) - (project.spentAmount || 0)).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-lg font-semibold mt-8 mb-4">Transaction Ledger</h3>
              <div className="glass rounded-xl overflow-hidden border border-white/10">
                <table className="w-full text-sm text-left">
                  <thead className="bg-background/50 text-muted-foreground border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Ref No.</th>
                      <th className="px-4 py-3 font-medium text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any) => (
                      <tr key={tx._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                            tx.transactionType.includes('Sanctioned') ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                            tx.transactionType.includes('Expense') || tx.transactionType.includes('Payment') ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                            tx.transactionType.includes('Fund') ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {tx.transactionType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{tx.description}</td>
                        <td className="px-4 py-3 text-muted-foreground">{tx.referenceNumber || "-"}</td>
                        <td className={`px-4 py-3 text-right font-medium ${tx.transactionType.includes('Expense') || tx.transactionType.includes('Payment') ? 'text-orange-500' : 'text-green-500'}`}>
                          {tx.transactionType.includes('Expense') || tx.transactionType.includes('Payment') ? '-' : '+'}₹{tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">No transactions recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="glass border-white/20">
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div><p className="font-medium">Location</p><p className="text-muted-foreground">{project.location || "Not specified"}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div><p className="font-medium">Timeline</p><p className="text-muted-foreground">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBD"} - {project.expectedCompletionDate ? new Date(project.expectedCompletionDate).toLocaleDateString() : "TBD"}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <IndianRupee className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div><p className="font-medium">Funding Source</p><p className="text-muted-foreground">{project.fundingSource || "Not specified"}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
