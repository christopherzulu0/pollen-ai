"use client"

import { PublicNav } from "./public-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sprout,
  HeartPulse,
  Shield,
  Smartphone,
  CloudRain,
  Wallet,
  Check,
  ArrowRight,
  Users,
  TrendingUp,
  Lock,
} from "lucide-react"
import Link from "next/link"

const insuranceProducts = [
  {
    icon: Sprout,
    title: "Crop Insurance",
    description: "Protect your harvest from unpredictable weather and crop failure",
    coverage: "Up to $10,000 per season",
    premium: "From $25/season",
    features: ["Drought protection", "Pest damage coverage", "Flood protection", "Quick claims"],
  },
  {
    icon: HeartPulse,
    title: "Health Emergency",
    description: "Medical coverage for unexpected health emergencies",
    coverage: "Up to $5,000 per year",
    premium: "From $8/month",
    features: ["Hospital visits", "Emergency surgery", "Medication coverage", "24/7 support"],
  },
  {
    icon: Shield,
    title: "Loan Protection",
    description: "Secure your family's future in case of death or disability",
    coverage: "Full loan balance",
    premium: "2% of loan amount",
    features: ["Death benefit", "Disability coverage", "Automatic payment", "Family protection"],
  },
  {
    icon: Wallet,
    title: "Group Savings Protection",
    description: "Protect your group's savings from fraud and theft",
    coverage: "Up to $50,000",
    premium: "From $15/month",
    features: ["Fraud protection", "Theft coverage", "Legal support", "Fast reimbursement"],
  },
  {
    icon: Smartphone,
    title: "Mobile Phone Insurance",
    description: "Protect your business lifeline from damage and theft",
    coverage: "Up to $800",
    premium: "From $5/month",
    features: ["Theft protection", "Accidental damage", "Screen repair", "Replacement device"],
  },
  {
    icon: CloudRain,
    title: "Weather Parametric",
    description: "Automatic payouts based on weather data and rainfall",
    coverage: "Up to $15,000",
    premium: "From $30/season",
    features: ["Automatic triggers", "No claims process", "Instant payout", "Satellite verified"],
  },
]

const benefits = [
  {
    icon: Users,
    title: "Community-First",
    description: "Designed specifically for cooperative savings groups with group discounts and shared benefits",
  },
  {
    icon: TrendingUp,
    title: "Affordable Premiums",
    description: "Pay-per-season options and flexible payment plans that fit your cooperative's budget",
  },
  {
    icon: Lock,
    title: "Secure & Transparent",
    description: "Blockchain-verified claims and transparent processes you can trust",
  },
]

const steps = [
  {
    number: "01",
    title: "Choose Your Coverage",
    description: "Select from our range of insurance products tailored to your cooperative's needs",
  },
  {
    number: "02",
    title: "Complete KYC",
    description: "Quick verification process to activate your insurance policy",
  },
  {
    number: "03",
    title: "Start Protection",
    description: "Your coverage begins immediately with flexible premium payment options",
  },
  {
    number: "04",
    title: "File Claims Easily",
    description: "Submit claims through our simple portal and receive fast payouts",
  },
]

export function InsuranceLanding() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Trusted by 10,000+ cooperative members
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Insurance Protection Built for Village Cooperatives
          </h1>

          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Affordable insurance solutions designed for cooperative savings groups. Protect your livelihood, health, and
            future with flexible coverage options.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base" asChild>
              <Link href="/kyc/submit">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
              <Link href="#products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Comprehensive Coverage Options</h2>
          <p className="text-lg text-muted-foreground">
            Six specialized insurance products designed to protect every aspect of your cooperative's financial
            well-being
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {insuranceProducts.map((product) => {
            const Icon = product.icon
            return (
              <Card key={product.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <CardDescription className="text-base">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coverage:</span>
                      <span className="font-semibold">{product.coverage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Premium:</span>
                      <span className="font-semibold text-primary">{product.premium}</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    {product.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                    <Link href="/member/insurance">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Why Choose Our Insurance</h2>
          <p className="text-lg text-muted-foreground">
            Insurance designed by cooperatives, for cooperatives. We understand your unique needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div key={benefit.title} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How It Works</h2>
          <p className="text-lg text-muted-foreground">Get protected in four simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="space-y-4">
                <div className="text-6xl font-bold text-primary/20">{step.number}</div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/20" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Protect Your Cooperative?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of cooperative members who trust us to protect their livelihoods, health, and future. Get
              started with affordable coverage today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="text-base" asChild>
                <Link href="/kyc/submit">
                  Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base border-primary-foreground/20 hover:bg-primary-foreground/10 bg-transparent"
                asChild
              >
                <Link href="/member/insurance">View All Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Village Savings Platform</h3>
              <p className="text-sm text-muted-foreground">
                Empowering cooperative savings groups with modern financial tools and insurance protection.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#products" className="hover:text-foreground transition-colors">
                    Crop Insurance
                  </Link>
                </li>
                <li>
                  <Link href="#products" className="hover:text-foreground transition-colors">
                    Health Coverage
                  </Link>
                </li>
                <li>
                  <Link href="#products" className="hover:text-foreground transition-colors">
                    Loan Protection
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Village Savings Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
