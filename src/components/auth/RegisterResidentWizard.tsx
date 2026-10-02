"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { registerResidentSchema, type RegisterResidentFormData } from "@/lib/auth-schemas";
import { authApi } from "@/lib/api-services";
import { getApiErrorMessage } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RegisterResidentWizard() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<RegisterResidentFormData>({
    resolver: zodResolver(registerResidentSchema),
    mode: "onTouched",
    defaultValues: {
      village: "Lodhaura"
    }
  });

  const nextStep = async (fieldsToValidate: (keyof RegisterResidentFormData)[]) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: RegisterResidentFormData) => {
    setSubmitting(true);
    try {
      await authApi.registerResident(data);
      toast.success("Resident profile created successfully! Please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className={`h-2 flex-1 mx-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`h-2 flex-1 mx-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`h-2 flex-1 mx-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
      </div>

      {step === 1 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-lg font-bold">Basic Information</h3>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number *</Label>
            <Input id="phone" placeholder="10-digit mobile number" error={errors.phone?.message} {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input id="email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <PasswordInput id="password" placeholder="Create a strong password" error={errors.password?.message} {...register("password")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <PasswordInput id="confirmPassword" placeholder="Confirm your password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          </div>
          <Button type="button" className="w-full mt-4" onClick={() => nextStep(["name", "phone", "email", "password", "confirmPassword"])}>
            Next Step <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-lg font-bold">Address Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House Number *</Label>
              <Input id="houseNumber" placeholder="e.g. 42" error={errors.houseNumber?.message} {...register("houseNumber")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street/Locality *</Label>
              <Input id="street" placeholder="Street Name" error={errors.street?.message} {...register("street")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="village">Village</Label>
              <Input id="village" disabled {...register("village")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postOffice">Post Office *</Label>
              <Input id="postOffice" placeholder="Post Office" error={errors.postOffice?.message} {...register("postOffice")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Input id="district" placeholder="District" error={errors.district?.message} {...register("district")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input id="state" placeholder="State" error={errors.state?.message} {...register("state")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">PIN Code *</Label>
            <Input id="pincode" placeholder="e.g. 241204" error={errors.pincode?.message} {...register("pincode")} />
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={() => nextStep(["houseNumber", "street", "postOffice", "district", "state", "pincode"])} className="flex-1">
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-lg font-bold">Household & Additional Info</h3>
          
          <div className="space-y-2">
            <Label htmlFor="familyHeadName">Head of Household Name *</Label>
            <Input id="familyHeadName" placeholder="Name of family head" error={errors.familyHeadName?.message} {...register("familyHeadName")} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(val) => setValue("gender", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" placeholder="e.g. Farmer, Student" {...register("occupation")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level</Label>
              <Input id="educationLevel" placeholder="e.g. High School" {...register("educationLevel")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
            <Input id="emergencyContact" placeholder="Contact number" {...register("emergencyContact")} />
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1" disabled={submitting}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
