import { Check, X, Loader2 } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";
import { LandingHeader } from "@/components/support/landing/landing-header";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    features: {
      calendars: "1 calendar",
      bookings: "2 / month",
      availability: true,
      googleCalendar: true,
      customBookingPage: true,
    },
  },
  {
    name: "Starter",
    features: {
      calendars: "3 calendars",
      bookings: "10 / month",
      availability: true,
      googleCalendar: true,
      customBookingPage: true,
    },
  },
  {
    name: "Pro",
    highlighted: true,
    features: {
      calendars: "Unlimited",
      bookings: "Unlimited",
      availability: true,
      googleCalendar: true,
      customBookingPage: true,
    },
  },
];

const featureLabels: Record<string, string> = {
  calendars: "Connected calendars",
  bookings: "Monthly bookings",
  availability: "Availability management",
  googleCalendar: "Google Calendar sync",
  customBookingPage: "Custom booking page",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* <LandingHeader /> */}
      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that works best for you. All plans include a 14-day
            free trial.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            Compare all features
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      className={cn(
                        "px-4 py-4 text-center font-semibold text-foreground",
                        plan.highlighted && "text-primary"
                      )}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(featureLabels).map((featureKey, index) => (
                  <tr
                    key={featureKey}
                    className={cn(
                      "border-b border-border",
                      index % 2 === 0 && "bg-muted/30"
                    )}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {featureLabels[featureKey]}
                    </td>
                    {plans.map((plan) => {
                      const value =
                        plan.features[featureKey as keyof typeof plan.features];
                      return (
                        <td key={plan.name} className="px-4 py-4 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="mx-auto size-5 text-secondary" />
                            ) : (
                              <X className="mx-auto size-5 text-muted-foreground" />
                            )
                          ) : (
                            <span className="text-sm font-semibold text-foreground">
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Clerk Pricing Table */}
      <section className="bg-muted/30 pb-20 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            Choose your plan
          </h2>
          <PricingTable
            appearance={{
              elements: {
                pricingTable: {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                },
                pricingTableCard: {
                  borderRadius: "1rem",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 4px 24px rgba(0, 51, 102, 0.08)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  background: "hsl(var(--card))",
                },
                pricingTableCardHeader: {
                  background:
                    "linear-gradient(135deg, #003366, hsl(210 100% 35%))",
                  color: "white",
                  borderRadius: "1rem 1rem 0 0",
                  padding: "2rem",
                },
                pricingTableCardTitle: {
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "0.25rem",
                },
                pricingTableCardDescription: {
                  fontSize: "0.9rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: "500",
                },
                pricingTableCardFee: {
                  color: "white",
                  fontWeight: "800",
                  fontSize: "2.5rem",
                },
                pricingTableCardFeePeriod: {
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "1rem",
                },
                pricingTableCardBody: {
                  padding: "1.5rem",
                  background: "hsl(var(--card))",
                },
                pricingTableCardFeatures: {
                  marginTop: "1rem",
                  gap: "0.75rem",
                },
                pricingTableCardFeature: {
                  fontSize: "0.9rem",
                  padding: "0.5rem 0",
                  fontWeight: "500",
                  color: "hsl(var(--muted-foreground))",
                },
                pricingTableCardButton: {
                  marginTop: "1.5rem",
                  borderRadius: "0.75rem",
                  fontWeight: "700",
                  padding: "0.875rem 2rem",
                  transition: "all 0.2s ease",
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, #003366, hsl(210 100% 35%))",
                  border: "none",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(0, 51, 102, 0.3)",
                },
                pricingTableCardPeriodToggle: {
                  color: "hsl(var(--foreground))",
                },
              },
            }}
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="space-y-4 text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Loading pricing options...
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}
