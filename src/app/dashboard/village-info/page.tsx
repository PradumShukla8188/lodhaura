"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, Loader2, Info } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VillageInfoSettingsPage() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["village-info"],
    queryFn: async () => {
      const res = await governanceApi.getVillageInfo();
      return res.data;
    },
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      history: "",
      population: 0,
      establishedYear: "",
      contactEmail: "",
      contactPhone: "",
      location: {
        district: "",
        state: "",
        country: "",
        pincode: ""
      }
    }
  });

  useEffect(() => {
    if (response?.data) {
      reset(response.data);
    }
  }, [response?.data, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => governanceApi.updateVillageInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-info"] });
      toast.success("Village information updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update village info");
    }
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Village Settings" 
          subtitle="Configure the core information and branding of the village portal." 
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core Info */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="h-5 w-5 text-primary" /> Core Information
            </CardTitle>
            <CardDescription>Primary details displayed across the public portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Village Name</label>
                <Input {...register("name")} placeholder="e.g. Lodhaura" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tagline</label>
                <Input {...register("tagline")} placeholder="e.g. A digital village" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Population</label>
                <Input type="number" {...register("population", { valueAsNumber: true })} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Established Year</label>
                <Input {...register("establishedYear")} className="bg-background/50" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea {...register("description")} rows={3} className="bg-background/50" />
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">History</label>
              <Textarea {...register("history")} rows={4} className="bg-background/50" />
            </div>
          </CardContent>
        </Card>

        {/* Location & Contact */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="text-xl">Location & Contact</CardTitle>
            <CardDescription>Official contact information and geography.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input type="email" {...register("contactEmail")} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone</label>
                <Input {...register("contactPhone")} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <Input {...register("location.district")} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Input {...register("location.state")} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input {...register("location.country")} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pincode</label>
                <Input {...register("location.pincode")} className="bg-background/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            size="lg"
            className="w-full sm:w-auto"
            disabled={isSubmitting || updateMutation.isPending}
          >
            {isSubmitting || updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
