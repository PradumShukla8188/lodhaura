"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Plus, Calendar, Clock, CheckCircle2, User as UserIcon } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/store/store";
import { hasPermission } from "@/lib/rbac-utils";

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", priority: "Medium", assignedTo: "", dueDate: "" });

  const canViewAll = hasPermission(user as any, 'Tasks', 'View') || user?.role === 'admin';
  const canCreate = hasPermission(user as any, 'Tasks', 'Create') || user?.role === 'admin';

  const { data: response, isLoading } = useQuery({
    queryKey: ["tasks", canViewAll],
    queryFn: async () => {
      const res = canViewAll ? await governanceApi.getTasks() : await governanceApi.getMyTasks();
      return res.data;
    },
  });

  const { data: usersRes } = useQuery({
    queryKey: ["govUsers"],
    queryFn: async () => (await governanceApi.getGovUsers()).data,
    enabled: canCreate,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreating(false);
      setFormData({ name: "", description: "", priority: "Medium", assignedTo: "", dueDate: "" });
      toast.success("Task assigned successfully");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to assign task"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => governanceApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const tasks = response?.data || [];
  const govUsers = usersRes?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title={canViewAll ? "All Assigned Tasks" : "My Tasks"} 
          subtitle="Track responsibilities and project tasks." 
        />
        {canCreate && (
          <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
            <Plus className="h-4 w-4" /> Assign Task
          </Button>
        )}
      </div>

      {isCreating && canCreate && (
        <Card className="glass border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Task Name *</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Assign To *</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.assignedTo}
                    onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                    required
                  >
                    <option value="">Select Officer...</option>
                    {govUsers.map((u: any) => <option key={u._id} value={u._id}>{u.name} ({u.roleName || 'Admin'})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign Task"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task: any) => {
            const isMine = task.assignedTo?._id === (user as any)?._id || task.assignedTo === (user as any)?._id;
            return (
            <Card key={task._id} className="glass border-white/20 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                task.priority === 'Urgent' ? 'bg-red-500' : 
                task.priority === 'High' ? 'bg-orange-500' : 
                task.priority === 'Medium' ? 'bg-blue-500' : 'bg-gray-500'
              }`} />
              <CardContent className="p-5 pl-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-base line-clamp-2">{task.name}</h3>
                  <Badge variant="outline" className={
                    task.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                    'bg-primary/10 text-primary border-primary/20'
                  }>
                    {task.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                
                <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5"/> {canViewAll ? task.assignedTo?.name : 'Me'}</span>
                    {task.dueDate && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/> Assigned by {task.assignedBy?.name}</div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-medium">{task.completionPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5 border border-white/5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${task.completionPercentage || 0}%` }} />
                  </div>
                </div>

                {(isMine || user?.role === 'admin') && task.status !== 'Completed' && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => updateMutation.mutate({ id: task._id, data: { status: 'In Progress', completionPercentage: 50 }})}>
                      Start Working
                    </Button>
                    <Button size="sm" className="w-full h-8 text-xs gap-1 bg-green-500 hover:bg-green-600 text-white" onClick={() => updateMutation.mutate({ id: task._id, data: { status: 'Completed', completionPercentage: 100 }})}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )})}
          {tasks.length === 0 && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-xl glass">
              No tasks found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
