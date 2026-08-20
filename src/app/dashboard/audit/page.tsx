"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Activity, ShieldAlert, CheckCircle } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";

export default function AuditLogsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: async () => {
      const res = await governanceApi.getAuditLogs();
      return res.data;
    },
  });

  const logs = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
          <ShieldAlert className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Immutable record of sensitive administrative actions.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="glass rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 text-muted-foreground border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Module</th>
                <th className="px-4 py-3 font-medium">Target ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">
                    {log.user?.name}
                    <span className="block text-[10px] text-muted-foreground">{log.user?.roleName || "Admin"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-background/50 border border-white/10">
                      <Activity className="h-3 w-3 text-primary" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{log.module}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{log.targetId || "-"}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">No audit logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
