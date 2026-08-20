"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Building, Briefcase, Mail, Phone, User, Link as LinkIcon, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { investorContactSchema, type InvestorContactFormData } from "@/lib/auth-schemas";
import { formApi } from "@/lib/api-services";

export function InvestorContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<InvestorContactFormData>({
    resolver: zodResolver(investorContactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: InvestorContactFormData) => {
    setIsSubmitting(true);
    try {
      await formApi.submitInvestorInquiry(data);
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl border border-border/60 p-6 shadow-2xl sm:p-10">
      <div className="absolute inset-0 bg-gradient-village opacity-5" />
      
      <div className="relative z-10">
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Send Investment Inquiry</h3>
        <p className="mb-8 text-sm text-muted-foreground">
          Fill out this form to explore opportunities, establish a company, or discuss an investment proposal with our panchayat board.
        </p>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-4 py-12 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-bold text-foreground">Inquiry Submitted Successfully</h4>
              <p className="max-w-md text-sm text-muted-foreground">
                Thank you for your interest in Lodhaura. Our development committee has received your proposal and will contact you shortly to discuss the possibilities.
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                Submit Another Inquiry
              </Button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="fullName" placeholder="John Doe" className="pl-10" error={errors.fullName?.message} {...register("fullName")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium text-foreground">Organization / Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="organization" placeholder="Your Company Ltd." className="pl-10" error={errors.organization?.message} {...register("organization")} />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="john@example.com" className="pl-10" error={errors.email?.message} {...register("email")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number *</label>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneInput
                        id="phone"
                        placeholder="Enter phone number"
                        defaultCountry="IN"
                        error={errors.phone?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="investmentType" className="text-sm font-medium text-foreground">Investment Type *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      id="investmentType"
                      className={`flex h-10 w-full appearance-none rounded-md border ${errors.investmentType ? 'border-destructive ring-destructive' : 'border-input'} bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      {...register("investmentType")}
                    >
                      <option value="">Select Type</option>
                      <option value="Establish Company/Startup">Establish Company/Startup</option>
                      <option value="Manufacturing Unit">Manufacturing Unit</option>
                      <option value="Agriculture Project">Agriculture Project</option>
                      <option value="NGO/Community Initiative">NGO/Community Initiative</option>
                      <option value="Real Estate/Infrastructure">Real Estate/Infrastructure</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.investmentType && (
                    <p className="text-[0.8rem] font-medium text-destructive">{errors.investmentType.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium text-foreground">Website / LinkedIn (Optional)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="website" type="url" placeholder="https://" className="pl-10" error={errors.website?.message} {...register("website")} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message / Proposal Details *</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="message"
                    placeholder="Briefly describe your idea, the required area/resources, and how it aligns with Lodhaura's growth..."
                    className="min-h-[120px] pl-10"
                    error={errors.message?.message}
                    {...register("message")}
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
                    Submitting...
                  </span>
                ) : (
                  <>
                    Submit Your Proposal
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Your information is secure and will only be shared with the official Lodhaura development committee.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
