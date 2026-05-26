import {
  ListOrdered,
  Bell,
  BarChart3,
  Share2,
  Shield,
  Zap,
  Globe,
  Webhook,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ListOrdered,
    title: "Smart Waitlist Management",
    description:
      "Create branded waitlist pages in minutes. Set custom priority tiers, acceptance criteria, and capacity limits. Drag-and-drop queue management with bulk actions.",
    color: "text-blue-600 bg-blue-50",
    highlights: ["Priority tiers", "Capacity controls", "Bulk management"],
  },
  {
    icon: Bell,
    title: "Automated Notification Sequences",
    description:
      "Send perfectly timed emails and SMS messages at every stage of the journey — from confirmation to invitation. Visual sequence builder with conditional logic.",
    color: "text-purple-600 bg-purple-50",
    highlights: ["Email + SMS", "Conditional triggers", "Visual builder"],
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics Dashboard",
    description:
      "Track signups, referral sources, conversion funnels, and engagement metrics live. Understand exactly where your signups come from and what makes them convert.",
    color: "text-green-600 bg-green-50",
    highlights: ["Conversion funnel", "Source tracking", "Cohort analysis"],
  },
  {
    icon: Share2,
    title: "Viral Referral Engine",
    description:
      "Reward users who refer friends with automatic position bumps and exclusive perks. Built-in social sharing for Twitter, LinkedIn, and direct links.",
    color: "text-orange-600 bg-orange-50",
    highlights: ["Position rewards", "Social sharing", "Fraud detection"],
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "Clerk-powered authentication with SSO, MFA, and role-based access control. SOC 2 Type II compliant. Your data stored securely in Supabase with row-level security.",
    color: "text-red-600 bg-red-50",
    highlights: ["Clerk auth + SSO", "SOC 2 compliant", "Row-level security"],
  },
  {
    icon: Webhook,
    title: "Deep Integrations",
    description:
      "Connect WaitlistPro to your CRM, email platform, or custom backend via webhooks and REST API. Native integrations with HubSpot, Mailchimp, and Zapier.",
    color: "text-teal-600 bg-teal-50",
    highlights: ["REST API", "Webhooks", "Zapier + HubSpot"],
  },
  {
    icon: Globe,
    title: "Custom Branded Pages",
    description:
      "Fully customizable waitlist landing pages with your logo, colors, and domain. No 'Powered by' watermarks. GDPR-compliant consent forms built in.",
    color: "text-indigo-600 bg-indigo-50",
    highlights: ["Custom domain", "White-label", "GDPR ready"],
  },
  {
    icon: Zap,
    title: "Instant Invitations",
    description:
      "Send invitations to batches of users in one click. Set automated drip invite schedules based on capacity and conversions. Never overwhelm your infrastructure again.",
    color: "text-yellow-600 bg-yellow-50",
    highlights: ["Batch invites", "Drip scheduling", "Capacity matching"],
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            Everything you need
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            One platform for your entire{" "}
            <span className="gradient-text">launch funnel</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Stop stitching together spreadsheets, email tools, and homegrown hacks.
            WaitlistPro handles everything from first signup to launch day.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`inline-flex rounded-xl p-2.5 ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
              <ul className="mt-4 space-y-1">
                {feature.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <div className="h-1 w-1 rounded-full bg-brand-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 active:scale-95"
          >
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-sm text-gray-400">
            No credit card required. Setup in under 5 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
