"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, IndianRupee, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function FundsDashboardPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["allTransactions"],
    queryFn: async () => {
      const res = await governanceApi.getTransactions();
      return res.data;
    },
  });

  const transactions = response?.data || [];
  
  const totalApproved = transactions.filter((t: any) => t.transactionType === 'Fund Sanctioned').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalReceived = transactions.filter((t: any) => t.transactionType === 'Fund Released' || t.transactionType === 'Fund Received').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalSpent = transactions.filter((t: any) => t.transactionType === 'Payment' || t.transactionType === 'Expense').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <PageHeader 
        title="Village Financial Dashboard" 
        subtitle="Global ledger tracking all project funds, sanctions, and expenses." 
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass border-white/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Sanctioned</p>
                <h3 className="text-3xl font-bold">₹{totalApproved.toLocaleString()}</h3>
              </CardContent>
            </Card>
            <Card className="glass border-white/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Received</p>
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-6 w-6 text-green-500" />
                  <h3 className="text-3xl font-bold text-green-500">₹{totalReceived.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-white/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Spent</p>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-6 w-6 text-orange-500" />
                  <h3 className="text-3xl font-bold text-orange-500">₹{totalSpent.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-primary/20 bg-primary/5">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm font-medium text-primary uppercase tracking-wider">Available Balance</p>
                <h3 className="text-3xl font-bold text-primary">₹{(totalReceived - totalSpent).toLocaleString()}</h3>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg font-semibold pt-4">Recent Transactions</h3>
          <div className="glass rounded-xl overflow-hidden border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 text-muted-foreground border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Amount (₹)</th>
                  <th className="px-4 py-3 font-medium text-right">Logged By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx: any) => (
                  <tr key={tx._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium">{tx.project?.name || "Global"}</td>
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
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{tx.description}</td>
                    <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${tx.transactionType.includes('Expense') || tx.transactionType.includes('Payment') ? 'text-orange-500' : 'text-green-500'}`}>
                      {tx.transactionType.includes('Expense') || tx.transactionType.includes('Payment') ? '-' : '+'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">{tx.createdBy?.name}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan={6} className="text-center p-8 text-muted-foreground">No financial transactions recorded in the system.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
