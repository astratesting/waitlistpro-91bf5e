"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Play, Sparkles } from "lucide-react";

const trustBadges = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
];

export default function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-purple-100 opacity-30 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Trusted by 10,000+ product teams worldwide
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Build anticipation.{" "}
            <span className="gradient-text">Capture leads.</span>{" "}
            Launch with momentum.
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500 leading-relaxed">
            WaitlistPro gives you everything you need to create viral waitlists,
            automate personalized notifications, and convert early signups into
            paying customers — all in one platform.
          </p>

          {/* Email capture form */}
          <div className="mx-auto mt-10 max-w-md">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-0 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-95"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 rounded-xl bg-green-50 px-6 py-4 text-green-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">You're in! Check your email to get started.</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-center gap-4">
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-1 text-xs text-gray-400">
                  <CheckCircle className="h-3 w-3 text-gray-300" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Demo Preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl shadow-gray-200/50">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 border-b border-gray-200 bg-white px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 rounded-md bg-gray-100 px-4 py-1 text-xs text-gray-400">
                  app.waitlistpro.com/dashboard
                </div>
              </div>

              {/* Mock Dashboard Screenshot */}
              <div className="bg-gray-50 p-6">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total Signups", value: "2,474", color: "bg-blue-500" },
                    { label: "Referral Rate", value: "39.4%", color: "bg-green-500" },
                    { label: "Notifications", value: "18,320", color: "bg-purple-500" },
                    { label: "Open Rate", value: "67.3%", color: "bg-orange-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                      <div className={`h-1 w-8 rounded-full ${stat.color} mb-3`} />
                      <div className="text-xs text-gray-500">{stat.label}</div>
                      <div className="mt-1 text-xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Signups Over Time</span>
                    <span className="text-xs text-gray-400">Last 30 days</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-20">
                    {[30, 45, 60, 52, 78, 85, 92, 100, 88, 95, 110, 120].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-brand-200"
                        style={{ height: `${h * 0.65}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-gray-900 shadow-lg">
                  <Play className="h-4 w-4 fill-brand-600 text-brand-600" />
                  Watch 2-min demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
