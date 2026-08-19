"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Loader2,
  IndianRupee,
} from "lucide-react";
import { donationApi } from "@/lib/api-services";
import { getApiErrorMessage } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

const PRESET_AMOUNTS = [101, 501, 1001, 2100, 5100];

function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayDonate() {
  const [amount, setAmount] = useState("501");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("Village Development Fund");
  const [loading, setLoading] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [keyId, setKeyId] = useState("");

  useEffect(() => {
    donationApi
      .getRazorpayConfig()
      .then((res) => {
        setRazorpayEnabled(res.data.data.enabled);
        setKeyId(res.data.data.keyId || "");
      })
      .catch(() => setRazorpayEnabled(false));
  }, []);

  const payWithRazorpay = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) {
      toast.error("Enter a valid amount (min ₹1).");
      return;
    }

    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error("Could not load payment gateway.");
        return;
      }

      const orderRes = await donationApi.createOrder({
        amount: numAmount,
        donorName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        purpose,
      });

      const { orderId, donationId, keyId: orderKeyId } = orderRes.data.data;
      const rzpKey = orderKeyId || keyId;

      if (!rzpKey) {
        toast.error("Razorpay key not configured. Add RAZORPAY_KEY_ID in backend .env");
        return;
      }

      const options = {
        key: rzpKey,
        amount: Math.round(numAmount * 100),
        currency: "INR",
        name: "Lodhaura Village Portal",
        description: purpose,
        order_id: orderId,
        prefill: { name, email, contact: phone },
        theme: { color: "#0F766E" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true,
        },
        config: {
          display: {
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await donationApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donationId,
            });
            toast.success("Thank you! Donation received successfully.");
          } catch {
            toast.error("Payment received but verification failed. Contact panchayat.");
          }
        },
        modal: {
          ondismiss: () => toast.info("Payment cancelled."),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Payment could not be started."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {PRESET_AMOUNTS.map((a) => (
          <Button
            key={a}
            type="button"
            variant={amount === String(a) ? "default" : "outline"}
            size="sm"
            className="text-xs sm:text-sm"
            onClick={() => setAmount(String(a))}
          >
            ₹{a}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Your Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </div>
        <div className="space-y-2">
          <Label>Amount (₹) *</Label>
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="501"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..." />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Purpose</Label>
        <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Smartphone className="h-3.5 w-3.5" /> UPI / Google Pay</span>
        <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> Cards</span>
        <span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" /> Wallets</span>
        <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> Net Banking</span>
      </div>

      {razorpayEnabled ? (
        <Button className="w-full gap-2" size="lg" onClick={payWithRazorpay} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Donate with Razorpay
        </Button>
      ) : (
        <p className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-4 text-sm text-muted-foreground">
          Razorpay not configured yet. Add <code className="text-primary">RAZORPAY_KEY_ID</code> and{" "}
          <code className="text-primary">RAZORPAY_KEY_SECRET</code> in backend <code>.env</code> file.
        </p>
      )}
    </div>
  );
}
