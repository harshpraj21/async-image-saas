"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { API } from "@/lib/api"
import { toast } from "sonner"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/store"
import { useRazorpayScript } from "@/lib/useRazorpay"
import { setUser } from "@/store/authSlice"

export type Plan = {
  id: string;
  credits: number;
  price: number;
};

export type RazorpayOrderResponse = {
  razorpay_order_id: string;
  amount: number;
  currency: string;
};

export function BuyCreditDialog() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>();
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()

  useRazorpayScript();

  useEffect(() => {
    if (open && plans.length === 0) {
      setLoading(true);
      API.get("/payment/plans")
        .then(res => setPlans(res.data))
        .catch(() => toast.error("Failed to load plans"))
        .finally(() => setLoading(false));
    }
  }, [open]);


  const handlePurchase = async () => {
    if (!selectedPlanId) {
      toast.error("Select a plan first");
      return;
    }

    setLoading(true)
    try {
      const res = await API.post<RazorpayOrderResponse>("/payment/create-order", {
        plan_id: selectedPlanId,
      });

      const razorpayOrder = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Image SaaS",
        description: "Credit Purchase",
        order_id: razorpayOrder.razorpay_order_id,
        handler: function (response: any) {
          toast.success("Payment Successful");
          API.get('/auth/me').then((me => dispatch(setUser(me.data))))
          
        },
        "prefill": {
          "name": user?.name,
          "email": user?.email
        },
        "theme": {
          "color": "#3399cc"
        }
      }

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      console.error(err);
      toast.error("Payment failed to initiate.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={loading}>Buy Credits</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Credit Plan</DialogTitle>
        </DialogHeader>

        <Select onValueChange={setSelectedPlanId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a plan" />
          </SelectTrigger>
          <SelectContent>
            {plans.map(plan => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.credits} credits for ₹{plan.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button disabled={!selectedPlanId} onClick={handlePurchase}>
          Pay & Buy
        </Button>
      </DialogContent>
    </Dialog>
  );
}




