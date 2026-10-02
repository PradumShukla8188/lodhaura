"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Star, Briefcase, IndianRupee, Clock, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { workerService, WorkerProfile } from "@/lib/api-workers";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";

export default function WorkerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hire Form State
  const [requiredDate, setRequiredDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await workerService.getWorkerById(id);
      if (res.data) setWorker(res.data);
      
      const reviewRes = await workerService.getWorkerReviews(id);
      if (reviewRes.data) setReviews(reviewRes.data);
    } catch (error) {
      console.error("Failed to fetch worker details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login?redirect=/workers/" + id);
      return;
    }

    if (!worker || !requiredDate || numberOfDays < 1) return;

    setIsSubmitting(true);
    try {
      const estimatedTotal = worker.pricePerDay * numberOfDays;
      await workerService.createRequest({
        workerId: worker._id,
        service: worker.category,
        requiredDate,
        numberOfDays,
        notes,
        estimatedTotal
      });
      setRequestSuccess(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Worker not found</h2>
        <Link href="/workers"><Button className="mt-4">Back to Workers</Button></Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-muted/30 border-b border-white/10 pt-24 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/workers" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Workers
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {worker.userId?.avatar ? (
                <img src={worker.userId.avatar} alt={worker.name} className="h-24 w-24 rounded-full object-cover shadow-lg border-4 border-background" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-4xl shadow-lg border-4 border-background">
                  {worker.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">{worker.name}</h1>
                  {worker.isVerified && (
                    <span title="Verified Worker">
                      <ShieldCheck className="h-6 w-6 text-green-500" />
                    </span>
                  )}
                </div>
                <p className="text-lg text-primary font-medium mt-1">{worker.category}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {worker.address}</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : "New"} ({worker.totalReviews} reviews)</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {worker.totalJobsCompleted} Jobs Completed</span>
                </div>
              </div>
            </div>
            <div className="bg-background/50 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center md:text-right w-full md:w-auto shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Pricing</p>
              <div className="flex items-baseline justify-center md:justify-end font-bold text-2xl text-foreground">
                <IndianRupee className="h-5 w-5 mr-0.5" />
                {worker.pricePerDay}
                <span className="text-base font-normal text-muted-foreground ml-1">/ Day</span>
              </div>
              {worker.pricePerHour && (
                <p className="text-sm text-muted-foreground mt-1">or ₹{worker.pricePerHour} / Hour</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details & Reviews */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass rounded-2xl p-6 md:p-8 border border-white/10 shadow-sm">
                <h3 className="text-xl font-bold mb-4">About Me</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{worker.description || "No description provided."}</p>
                
                <h3 className="text-xl font-bold mt-8 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Experience</p>
                    <p className="font-semibold">{worker.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Service Area</p>
                    <p className="font-semibold">Within {worker.serviceAreaRadius} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Available Days</p>
                    <p className="font-semibold">{worker.availableDays?.join(", ") || "All days"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="font-semibold flex items-center gap-2">
                      {worker.availabilityStatus ? (
                        <><span className="h-2 w-2 rounded-full bg-green-500"></span> Available Now</>
                      ) : (
                        <><span className="h-2 w-2 rounded-full bg-red-500"></span> Currently Busy</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="glass rounded-2xl p-6 md:p-8 border border-white/10 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Reviews & Ratings</h3>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground">No reviews yet. Be the first to hire and review!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {review.userId?.avatar ? (
                              <img src={review.userId.avatar} alt="User" className="h-10 w-10 rounded-full" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                                {review.userId?.name?.charAt(0) || "U"}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-sm">{review.userId?.name || "User"}</p>
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-amber-500" : "text-muted opacity-30"}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.review && <p className="text-sm text-muted-foreground mt-2">{review.review}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Hire Form */}
            <div>
              <div className="glass rounded-2xl p-6 border border-white/10 shadow-lg sticky top-24">
                {requestSuccess ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                    <p className="text-muted-foreground mb-6">Your request has been sent to {worker.name}. They will review and accept it shortly.</p>
                    <Link href="/dashboard">
                      <Button className="w-full">View My Requests</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-6">Request Worker</h3>
                    <form onSubmit={handleHireSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Required Date</label>
                        <Input 
                          type="date" 
                          required 
                          min={new Date().toISOString().split('T')[0]}
                          value={requiredDate}
                          onChange={(e) => setRequiredDate(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Number of Days</label>
                        <Input 
                          type="number" 
                          min="1" 
                          required 
                          value={numberOfDays}
                          onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
                          className="bg-background/50"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Work Requirements / Notes</label>
                        <Textarea 
                          placeholder="Describe the work you need done..." 
                          className="bg-background/50 resize-none h-24"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <div className="bg-muted/50 p-4 rounded-xl border border-white/5 my-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Worker Charge</span>
                          <span>₹{worker.pricePerDay} / day</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold">
                          <span>Estimated Total</span>
                          <span className="text-primary text-lg">₹{worker.pricePerDay * (numberOfDays || 1)}</span>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base" 
                        disabled={isSubmitting || !worker.availabilityStatus}
                      >
                        {isSubmitting ? "Submitting..." : !worker.availabilityStatus ? "Currently Unavailable" : "Hire Worker"}
                      </Button>
                      
                      {!isAuthenticated && (
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          You will be asked to login first.
                        </p>
                      )}
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
