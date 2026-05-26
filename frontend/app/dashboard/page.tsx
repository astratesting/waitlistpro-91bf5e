"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  TrendingUp,
  Bell,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const signupData = [
  { date: "May 1", signups: 120, referrals: 34 },
  { date: "May 5", signups: 280, referrals: 89 },
  { date: "May 10", signups: 390, referrals: 134 },
  { date: "May 15", signups: 520, referrals: 198 },
  { date: "May 18", signups: 610, referrals: 245 },
  { date: "May 20", signups: 780, referrals: 312 },
  { date: "May 22", signups: 940, referrals: 378 },
  { date: "May 25", signups: 1240, referrals: 489 },
];

const conversionData = [
  { stage: "Page Visit", count: 8400 },
  { stage: "Form Start", count: 5200 },
  { stage: "Submitted", count: 3100 },
  { stage: "Confirmed", count: 2800 },
  { stage: "Invited", count: 1240 },
];

const recentSignups = [
  { name: "Alex Thompson", email: "alex@startup.io", position: 1, referrals: 12, joined: "2m ago", source: "Twitter" },
  { name: "Maria Garcia", email: "m.garcia@gmail.com", position: 2, referrals: 8, joined: "5m ago", source: "Product Hunt" },
  { name: "James Kim", email: "jkim@corp.co", position: 3, referrals: 5, joined: "12m ago", source: "Direct" },
  { name: "Priya Singh", email: "priya@designco.com", position: 4, referrals: 3, joined: "18m ago", source: "LinkedIn" },
  { name: "Chen Wei", email: "cwei@techlab.io", position: 5, referrals: 1, joined: "23m ago", source: "Twitter" },
];

const waitlists = [
  {
    id: 1,
    name: "Beta Launch — Spring 2025",
    signups: 1240,
    goal: 2000,
    status: "active",
    conversion: "14.8%",
    lastActivity: "2 min ago",
  },
  {
    id: 2,
    name: "Enterprise Early Access",
    signups: 342,
    goal: 500,
    status: "active",
    conversion: "22.1%",
    lastActivity: "1 hour ago",
  },
  {
    id: 3,
    name: "Mobile App Waitlist",
    signups: 892,
    goal: 1000,
    status: "paused",
    conversion: "9.3%",
    lastActivity: "3 days ago",
  },
];

const statCards = [
  {
    label: "Total Signups",
    value: "2,474",
    change: "+18.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Referral Rate",
    value: "39.4%",
    change: "+4.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Notifications Sent",
    value: "18,320",
    change: "+12.7%",
    trend: "up",
    icon: Bell,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Avg. Open Rate",
    value: "67.3%",
    change: "-2.1%",
    trend: "down",
    icon: MousePointerClick,
    color: "text-orange-600 bg-orange-50",
  },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [copiedLink, setCopiedLink] = useState<number | null>(null);

  const handleCopyLink = (id: number) => {
    navigator.clipboard.writeText(`https://waitlistpro.com/w/${id}`);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your waitlists today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50">
            Export CSV
          </button>
          <a
            href="/dashboard/waitlists/new"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            + New Waitlist
          </a>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  card.trend === "up" ? "text-green-600" : "text-red-500"
                }`}
              >
                {card.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {card.change}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-400">vs. last 30 days</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Signups Over Time */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Signups Over Time</h3>
              <p className="text-sm text-gray-500">Total signups vs. referred signups</p>
            </div>
            <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>All time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={signupData}>
              <defs>
                <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5461f5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#5461f5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="referralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="signups" stroke="#5461f5" fill="url(#signupGrad)" strokeWidth={2} name="Total Signups" />
              <Area type="monotone" dataKey="referrals" stroke="#7c3aed" fill="url(#referralGrad)" strokeWidth={2} name="Referrals" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-1 font-semibold text-gray-900">Conversion Funnel</h3>
          <p className="mb-4 text-sm text-gray-500">Signup flow performance</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
              <Tooltip />
              <Bar dataKey="count" fill="#5461f5" radius={[0, 4, 4, 0]} name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waitlists Table + Recent Signups */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Waitlists */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900">Your Waitlists</h3>
            <a href="/dashboard/waitlists" className="text-sm text-brand-600 hover:text-brand-700">
              View all
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {waitlists.map((wl) => (
              <div key={wl.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm">{wl.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          wl.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {wl.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>{wl.signups.toLocaleString()} / {wl.goal.toLocaleString()} signups</span>
                      <span>{wl.conversion} CVR</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-600"
                        style={{ width: `${Math.min((wl.signups / wl.goal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-1">
                    <button
                      onClick={() => handleCopyLink(wl.id)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title="Copy link"
                    >
                      {copiedLink === wl.id ? (
                        <span className="text-xs text-green-600">Copied!</span>
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <a
                      href={`/w/${wl.id}`}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title="View public page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Signups */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900">Recent Signups</h3>
            <button className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700">
              <Eye className="h-3.5 w-3.5" />
              View all
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentSignups.map((signup) => (
              <div key={signup.email} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {signup.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{signup.name}</p>
                    <p className="text-xs text-gray-500">{signup.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      #{signup.position}
                    </span>
                    {signup.referrals > 0 && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        +{signup.referrals} refs
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{signup.joined} · {signup.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
