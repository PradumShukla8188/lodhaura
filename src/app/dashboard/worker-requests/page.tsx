"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { workerService } from "@/lib/api-workers";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, Calendar, CheckCircle2, XCircle, IndianRupee, Clock, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function WorkerRequestsPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<"requests" | "jobs">("requests");
  const [requests, setRequests] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Review State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/dashboard/worker-requests");
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reqRes, jobsRes] = await Promise.all([
        workerService.getMyRequests().catch(() => ({ data: [] })),
        workerService.getMyJobs().catch(() => ({ data: [] }))
      ]);
      if (reqRes.data) setRequests(reqRes.data);
      if (jobsRes.data) setJobs(jobsRes.data);
    } catch (error) {
      console.error("Failed to fetch requests/jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await workerService.updateRequestStatus(id, status);
      fetchData(); // Refresh data
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await workerService.addReview({
        requestId: selectedRequestId,
        workerId: selectedWorkerId,
        rating,
        review
      });
      alert("Review submitted successfully!");
      setReviewModalOpen(false);
      setReview("");
      setRating(5);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const openReviewModal = (requestId: string, workerId: string) => {
    setSelectedRequestId(requestId);
    setSelectedWorkerId(workerId);
    setReviewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium">Pending</span>;
      case 'Accepted': return <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-medium">Accepted</span>;
      case 'Rejected': return <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-medium">Rejected</span>;
      case 'In Progress': return <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-xs font-medium">In Progress</span>;
      case 'Completed': return <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-medium">Completed</span>;
      case 'Cancelled': return <span className="bg-gray-500/10 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">Cancelled</span>;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Worker Requests & Jobs"
        subtitle="Manage the workers you've hired or the jobs you've received"
        badge="Dashboard"
      />
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex gap-4 mb-8">
            <Button 
              variant={activeTab === "requests" ? "default" : "outline"} 
              onClick={() => setActiveTab("requests")}
              className="flex-1 sm:flex-none"
            >
              My Requests (Hired)
            </Button>
            <Button 
              variant={activeTab === "jobs" ? "default" : "outline"} 
              onClick={() => setActiveTab("jobs")}
              className="flex-1 sm:flex-none"
            >
              My Jobs (Received)
            </Button>
          </div>

          <div className="space-y-6">
            {activeTab === "requests" && (
              <>
                {requests.length === 0 ? (
                  <div className="text-center py-16 glass rounded-2xl border border-white/10">
                    <p className="text-muted-foreground">You haven't hired any workers yet.</p>
                    <Button onClick={() => router.push("/workers")} className="mt-4">Find Workers</Button>
                  </div>
                ) : (
                  requests.map(req => (
                    <div key={req._id} className="glass rounded-xl p-6 border border-white/10 shadow-sm flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">{req.service}</h3>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Worker:</span> {req.workerId?.name || "Unknown Worker"}</p>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Date:</span> {new Date(req.requiredDate).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Duration:</span> {req.numberOfDays} days</p>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Notes:</span> {req.notes}</p>
                      </div>
                      <div className="md:w-48 bg-muted/30 rounded-lg p-4 border border-white/5 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Total</p>
                          <p className="text-2xl font-bold text-primary flex items-center mt-1"><IndianRupee className="h-5 w-5" />{req.estimatedTotal}</p>
                        </div>
                        <div className="mt-4">
                          {req.status === 'Completed' && (
                            <Button size="sm" variant="outline" className="w-full" onClick={() => openReviewModal(req._id, req.workerId._id)}>
                              Leave Review
                            </Button>
                          )}
                          {req.status === 'Pending' && (
                            <Button size="sm" variant="destructive" className="w-full" onClick={() => handleStatusUpdate(req._id, 'Cancelled')}>
                              Cancel Request
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "jobs" && (
              <>
                {jobs.length === 0 ? (
                  <div className="text-center py-16 glass rounded-2xl border border-white/10">
                    <p className="text-muted-foreground">You haven't received any job requests yet.</p>
                    <p className="text-sm mt-2">Make sure your worker profile is active and verified.</p>
                  </div>
                ) : (
                  jobs.map(job => (
                    <div key={job._id} className="glass rounded-xl p-6 border border-white/10 shadow-sm flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg">Job: {job.service}</h3>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <p className="text-sm font-semibold mb-2">Customer Details</p>
                          <p className="text-sm text-muted-foreground">Name: {job.userId?.name}</p>
                          <p className="text-sm text-muted-foreground">Phone: {job.userId?.phone || "N/A"}</p>
                        </div>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Date Required:</span> {new Date(job.requiredDate).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Duration:</span> {job.numberOfDays} days</p>
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Notes:</span> {job.notes}</p>
                      </div>
                      <div className="md:w-48 bg-muted/30 rounded-lg p-4 border border-white/5 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Payout</p>
                          <p className="text-2xl font-bold text-green-500 flex items-center mt-1"><IndianRupee className="h-5 w-5" />{job.estimatedTotal}</p>
                        </div>
                        <div className="mt-4 space-y-2">
                          {job.status === 'Pending' && (
                            <>
                              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(job._id, 'Accepted')}>Accept</Button>
                              <Button size="sm" variant="destructive" className="w-full" onClick={() => handleStatusUpdate(job._id, 'Rejected')}>Reject</Button>
                            </>
                          )}
                          {job.status === 'Accepted' && (
                            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleStatusUpdate(job._id, 'In Progress')}>Start Job</Button>
                          )}
                          {job.status === 'In Progress' && (
                            <Button size="sm" className="w-full" onClick={() => handleStatusUpdate(job._id, 'Completed')}>Mark Completed</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass-strong border border-white/20 p-6 rounded-2xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${rating === num ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Review Text</label>
                <Textarea 
                  placeholder="How was the service?" 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="bg-background/50 resize-none h-24"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmittingReview}>
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
