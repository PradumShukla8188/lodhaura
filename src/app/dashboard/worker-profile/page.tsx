"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { workerService, WorkerProfile } from "@/lib/api-workers";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Briefcase } from "lucide-react";

export default function WorkerProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    category: "Laborer",
    skills: "",
    experience: "",
    description: "",
    address: "",
    serviceAreaRadius: 10,
    pricePerDay: 500,
    pricePerHour: "",
    availableDays: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
    availabilityStatus: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/dashboard/worker-profile");
      return;
    }
    fetchMyProfile();
  }, [isAuthenticated]);

  const fetchMyProfile = async () => {
    try {
      const res = await workerService.getMyProfile();
      if (res.data) {
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          mobileNumber: res.data.mobileNumber,
          category: res.data.category,
          skills: res.data.skills.join(", "),
          experience: res.data.experience,
          description: res.data.description,
          address: res.data.address,
          serviceAreaRadius: res.data.serviceAreaRadius,
          pricePerDay: res.data.pricePerDay,
          pricePerHour: res.data.pricePerHour?.toString() || "",
          availableDays: res.data.availableDays.join(","),
          availabilityStatus: res.data.availabilityStatus,
        });
      }
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        name: user?.name || "",
        mobileNumber: user?.phone || "",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        availableDays: formData.availableDays.split(",").map(s => s.trim()).filter(Boolean),
        pricePerHour: formData.pricePerHour ? Number(formData.pricePerHour) : null,
      };

      if (profile) {
        await workerService.updateProfile(payload);
        alert("Worker profile updated successfully!");
      } else {
        const res = await workerService.registerWorker(payload);
        setProfile(res.data);
        alert("Successfully registered as a Worker!");
      }
    } catch (error) {
      console.error("Failed to save worker profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={profile ? "Manage Worker Profile" : "Become a Worker"}
        subtitle="Offer your services to the community and get hired locally"
        badge="Worker Dashboard"
      />
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <div className="glass p-8 rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="bg-primary/20 p-4 rounded-xl text-primary">
                <Briefcase className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile ? "Your Worker Profile" : "Registration Details"}</h2>
                <p className="text-muted-foreground text-sm">Fill in your professional details to be discovered by villagers.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="bg-background/50" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mobile Number</label>
                  <Input 
                    required 
                    value={formData.mobileNumber} 
                    onChange={e => setFormData({...formData, mobileNumber: e.target.value})} 
                    className="bg-background/50" 
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category / Service</label>
                  <select 
                    required 
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="Mason">Mason</option>
                    <option value="Laborer">Laborer</option>
                    <option value="Driver">Driver</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Experience</label>
                  <Input 
                    required 
                    placeholder="e.g. 5 Years"
                    value={formData.experience} 
                    onChange={e => setFormData({...formData, experience: e.target.value})} 
                    className="bg-background/50" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Skills (Comma separated)</label>
                  <Input 
                    required 
                    placeholder="e.g. Wiring, Repair, Installation"
                    value={formData.skills} 
                    onChange={e => setFormData({...formData, skills: e.target.value})} 
                    className="bg-background/50" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Short Description / About You</label>
                  <Textarea 
                    required 
                    placeholder="Describe your expertise and why people should hire you..."
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="bg-background/50 h-24 resize-none" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Address / Location</label>
                  <Input 
                    required 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="bg-background/50" 
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Daily Charge (₹)</label>
                  <Input 
                    type="number" 
                    required 
                    value={formData.pricePerDay} 
                    onChange={e => setFormData({...formData, pricePerDay: Number(e.target.value)})} 
                    className="bg-background/50" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Hourly Charge (Optional ₹)</label>
                  <Input 
                    type="number" 
                    value={formData.pricePerHour} 
                    onChange={e => setFormData({...formData, pricePerHour: e.target.value})} 
                    className="bg-background/50" 
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-white/5">
                  <div>
                    <h4 className="font-semibold">Availability Status</h4>
                    <p className="text-sm text-muted-foreground">Turn this off if you are currently busy and cannot accept new jobs.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.availabilityStatus}
                      onChange={e => setFormData({...formData, availabilityStatus: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end">
                <Button type="submit" size="lg" disabled={isSaving} className="w-full sm:w-auto px-10">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {profile ? "Save Changes" : "Register as Worker"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
