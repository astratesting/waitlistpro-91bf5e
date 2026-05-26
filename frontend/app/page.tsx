import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { CheckCircle, ArrowRight, Star, Users, BarChart3, Bell } from "lucide-react";

const socialProof = [
  { metric: "10,000+", label: "Product teams" },
  { metric: "2.4M+", label: "Signups captured" },
  { metric: "94%", label: "Avg conversion rate" },
  { metric: "$3.31B", label: "Market opportunity" },
];

const testimonials = [
  {
    quote: "WaitlistPro helped us go from 0 to 12,000 beta signups in 3 weeks. The referral tracking alone paid for itself on day one.",
    author: "Sarah Chen",
    role: "Founder, Launchpad AI",
    avatar: "SC",
  },
  {
    quote: "We replaced four different tools with WaitlistPro. The analytics dashboard finally gave us real insight into our launch funnel.",
    author: "Marcus Rivera",
    role: "Head of Growth, Orbit SaaS",
    avatar: "MR",
  },
  {
    quote: "The automated notification sequences converted 31% of our waitlist into paying customers on launch day. Nothing else comes close.",
    author: "Priya Patel",
    role: "CPO, Velox Labs",
    avatar: "PP",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for indie hackers and small launches",
    features: [
      "Up to 1,000 waitlist signups",
      "1 active waitlist",
      "Email notifications",
      "Basic analytics",
      "Referral tracking",
      "Custom thank-you page",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/month",
    description: "For growing teams serious about launch success",
    features: [
      "Up to 25,000 waitlist signups",
      "5 active waitlists",
      "Email + SMS notifications",
      "Advanced analytics & cohorts",
      "Priority queue management",
      "Custom domain & branding",
      "Webhook integrations",
      "A/B test landing pages",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "$199",
    period: "/month",
    description: "Enterprise-grade for high-volume launches",
    features: [
      "Unlimited signups",
      "Unlimited waitlists",
      "All notification channels",
      "Real-time analytics dashboard",
      "API access",
      "Dedicated account manager",
      "SOC 2 compliance",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />

      {/* Social Proof Strip */}
      <section className="border-y border-gray-100 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {socialProof.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl font-bold text-brand-600">{item.metric}</div>
                <div className="mt-1 text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Launch your waitlist in{" "}
              <span className="gradient-text">under 5 minutes</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              No code required. Built for speed. Designed to convert.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: <Users className="h-6 w-6" />,
                title: "Create your waitlist",
                description:
                  "Set up your branded waitlist page with custom fields, referral mechanics, and priority tiers in minutes.",
              },
              {
                step: "02",
                icon: <Bell className="h-6 w-6" />,
                title: "Configure notifications",
                description:
                  "Design automated email and SMS sequences that keep your audience engaged from signup to launch day.",
              },
              {
                step: "03",
                icon: <BarChart3 className="h-6 w-6" />,
                title: "Track and convert",
                description:
                  "Monitor signups, referrals, and engagement in real-time. Prioritize your best leads and launch with confidence.",
              },
            ].map((step) => (
              <div key={step.step} className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="absolute -top-4 left-8 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                  {step.step}
                </div>
                <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {step.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-24" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by product teams worldwide
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                <p className="text-gray-600 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.author}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24" id="pricing">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? "gradient-brand text-white shadow-2xl shadow-brand-200 ring-2 ring-brand-500"
                    : "bg-white ring-1 ring-gray-100 shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-gray-900">
                    Most Popular
                  </div>
                )}
                <div className={plan.highlighted ? "text-white/80" : "text-gray-500"}>
                  {plan.name}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-gray-400"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/80" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle
                        className={`h-4 w-4 flex-shrink-0 ${
                          plan.highlighted ? "text-white" : "text-brand-600"
                        }`}
                      />
                      <span className={`text-sm ${plan.highlighted ? "text-white/90" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/sign-up"
                  className={`mt-8 flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-white text-brand-600 hover:bg-gray-50"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="gradient-brand mx-auto max-w-4xl rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to launch your next big thing?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Join 10,000+ product teams using WaitlistPro to build anticipation,
              capture leads, and convert them into customers.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/sign-up"
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-brand-600 shadow-lg transition hover:bg-gray-50"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-white/60">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-sm font-bold text-white">W</span>
              </div>
              <span className="font-bold text-gray-900">WaitlistPro</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Blog</a>
              <a href="#" className="hover:text-gray-900">Support</a>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 WaitlistPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
