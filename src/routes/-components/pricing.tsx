"use client";
import axios from "axios";
import Stripe from "stripe";

import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";
import type { User } from "@/lib/types";
import { tryCatchWrapper } from "@/lib/utils/client";
import { polarBaseUrl } from "@/lib/utils/server";
import { useRouter } from "@tanstack/react-router";
async function createCheckoutSession(mode: string) {
  try {
    const stripe = new Stripe(
      "rk_test_51RxtB51tNDBT2PI2F7D7qtbXRbJdQE92ImqICUke2THpSPRf8MWFan3UKeatCOfJYWmmuqAABMNqPuDR1YTOi0Re00JY4ceKI8"
    );
    const session = await stripe.checkout.sessions.create({
      success_url: window.location.origin,
      // mode: "subscription",
      mode: mode === "p" ? "payment" : "subscription",
      // mode: "payment",
      line_items: [
        {
          // price: "price_1SAVJ51tNDBT2PI2VK95fv4P", // onetime
          // price: "price_1S9S6j1tNDBT2PI2q3pSFUct", // susb
          price:
            mode === "p"
              ? "price_1SAVJ51tNDBT2PI2VK95fv4P"
              : "price_1S9S6j1tNDBT2PI2q3pSFUct", // susb
          quantity: 1,
        },
      ],
      metadata: {
        insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
        insightly_session_id: "s60250873-e2f6-4243-aaff-5643b4b28657",
      },
    });

    console.log("Checkout session created:", session.id);
    if (session.url) {
      window.location.href = session.url;
    }

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
export default function Pricing({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleCheckout(plan: string) {
    tryCatchWrapper({
      callback: async () => {
        if (plan === "starter") {
          router.navigate({ to: "/dashboard" });

          return;
        }
        const res = await axios.post(polarBaseUrl + "/checkouts", {
          metadata: {
            insightly_visitor_id: "912249d1-202d-4cd8-84c2-0c1a73aae874",
            insightly_session_id: "s60250873-e2f6-4243-aaff-5643b4b28657",
          },
          products: ["313644f9-2a08-4510-b428-939d2ec5a493"],
        });

        if (res.data?.url) {
          window.location.href = res.data.url;
        }
      },
    });
  }

  return (
    <article id="pricing">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <PricingTableOne
          className="bg-transparent"
          onPlanSelect={handleCheckout}
          theme={"classic"}
          plans={plans}
        />
      </div>
    </article>
  );
}
