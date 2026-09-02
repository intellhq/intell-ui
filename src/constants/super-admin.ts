import {
  BarChart3,
  Bell,
  Headphones,
  MessageSquareText,
  ShieldUser,
  Users,
} from "lucide-react";
import type {
  SuperAdminActivity,
  SuperAdminMetric,
  SuperAdminNavItem,
  SuperAdminTableRow,
} from "@/types/super-admin";

export const SUPER_ADMIN_NAV_ITEMS: SuperAdminNavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/super-admin/dashboard" },
  { key: "admins", label: "Admins", href: "/super-admin/admins" },
  { key: "users", label: "Users", href: "/super-admin/users" },
  { key: "feedback", label: "Feedback", href: "/super-admin/feedback" },
  {
    key: "customer-support",
    label: "Customer Support",
    href: "/super-admin/customer-support",
  },
  {
    key: "communications",
    label: "Communications",
    href: "/super-admin/communications",
  },
];

export const SUPER_ADMIN_METRICS: SuperAdminMetric[] = [
  {
    label: "New Users",
    value: "268",
    helper: "Smart inverter users this month",
    change: "+9.0% vs last month",
    icon: Users,
  },
  {
    label: "Total Users",
    value: "2,759",
    helper: "Households and businesses tracked",
    change: "+11.43% vs last month",
    icon: Users,
  },
  {
    label: "Active Installers",
    value: "128",
    helper: "Installer and EPC partner accounts",
    change: "+8.2% vs last month",
    icon: ShieldUser,
  },
  {
    label: "Open Feedback",
    value: "36",
    helper: "Product and pilot feedback items",
    change: "12 high priority",
    icon: MessageSquareText,
  },
];

export const SUPER_ADMIN_DASHBOARD_ROWS: SuperAdminTableRow[] = [
  {
    id: "USR-1029",
    name: "Auzan Nugraha Agustian",
    email: "auzan@example.com",
    status: "Active",
    role: "Free",
    date: "12 Aug 2026",
    meta: "Last active: today 10:04",
    amount: "$0.003",
  },
  {
    id: "USR-1030",
    name: "Abdallah",
    email: "abdallah@example.com",
    status: "Active",
    role: "Installer referral",
    date: "12 Aug 2026",
    meta: "Last active: today 04:48",
    amount: "$0.011",
  },
  {
    id: "USR-1031",
    name: "Mishi Chaudhary",
    email: "mishi@example.com",
    status: "Pending",
    role: "Pilot",
    date: "12 Aug 2026",
    meta: "Last active: today 00:07",
    amount: "$0.005",
  },
];

export const SUPER_ADMIN_ADMIN_ROWS: SuperAdminTableRow[] = [
  {
    id: "ADM-001",
    name: "Richard",
    email: "richard@energyiq.africa",
    status: "Active",
    role: "Admin",
    date: "May 8, 2026",
    meta: "Last Active: Jun 3, 06:47 PM",
  },
  {
    id: "ADM-002",
    name: "Sarah",
    email: "sarah@energyiq.africa",
    status: "Active",
    role: "Super Admin",
    date: "Mar 31, 2026",
    meta: "Last Active: Jul 6, 06:05 PM",
  },
  {
    id: "ADM-003",
    name: "John",
    email: "john@energyiq.africa",
    status: "Active",
    role: "Super Admin",
    date: "May 25, 2026",
    meta: "Last Active: Jul 30, 04:18 PM",
  },
];

export const SUPER_ADMIN_ACTIVITY_LOG: SuperAdminActivity[] = [
  {
    id: "ACT-001",
    action: "Super Admin promoted John to super admin",
    date: "25 May 2026, 10:25",
  },
  {
    id: "ACT-002",
    action: "Admin assigned pilot feedback review to product team",
    date: "24 May 2026, 16:00",
  },
  {
    id: "ACT-003",
    action: "Super Admin added installer onboarding checklist",
    date: "24 May 2026, 15:59",
  },
];

export const SUPER_ADMIN_USER_ROWS: SuperAdminTableRow[] = [
  {
    id: "USR-2201",
    name: "Daphne Luna",
    email: "daphne@example.com",
    status: "Active",
    role: "Free",
    date: "29 Jan 2026 at 15:16",
    meta: "Smart inverter user",
    amount: "$0",
  },
  {
    id: "USR-2202",
    name: "Manga Anime",
    email: "manga@example.com",
    status: "Active",
    role: "Free",
    date: "26 Jun 2026 at 21:45",
    meta: "Beta tester",
    amount: "$0.003",
  },
  {
    id: "USR-2203",
    name: "2434 AYATA",
    email: "ayata@example.com",
    status: "Active",
    role: "Pilot",
    date: "24 Apr 2026 at 13:11",
    meta: "Installer-managed account",
    amount: "$0.003",
  },
];

export const SUPER_ADMIN_FEEDBACK_ROWS: SuperAdminTableRow[] = [
  {
    id: "FDB-3301",
    name: "Savings forecast clarity",
    content: "Users want clearer explanations for cost and savings reports.",
    status: "Open",
    priority: "High",
    date: "10/07/2026",
  },
  {
    id: "FDB-3302",
    name: "Report sharing",
    content: "Make public report links easier to understand before sharing.",
    status: "In Progress",
    priority: "Medium",
    date: "07/06/2026",
  },
  {
    id: "FDB-3303",
    name: "Installer onboarding",
    content: "Installers need a shorter guide for qualifying compatible inverters.",
    status: "Open",
    priority: "-",
    date: "24/04/2026",
  },
];

export const SUPER_ADMIN_SUPPORT_ROWS: SuperAdminTableRow[] = [
  {
    id: "SUP-4401",
    name: "HAMISSOU",
    content: "User cannot confirm whether inverter sync is current.",
    status: "Open",
    priority: "High",
    date: "Aug 7, 2026",
  },
  {
    id: "SUP-4402",
    name: "Mahir",
    content: "Requesting support for installer-managed business account.",
    status: "Open",
    priority: "Medium",
    date: "Jul 16, 2026",
  },
  {
    id: "SUP-4403",
    name: "John Doe",
    content: "Needs help understanding AI assistant recommendations.",
    status: "Resolved",
    priority: "-",
    date: "Jun 7, 2026",
  },
];

export const SUPER_ADMIN_COMMUNICATION_ROWS: SuperAdminTableRow[] = [
  {
    id: "COM-5501",
    name: "Installer onboarding kit",
    content: "Partner guide for qualifying smart inverter and WiFi/GPRS systems.",
    status: "In Progress",
    priority: "High",
    date: "Aug 12, 2026",
  },
  {
    id: "COM-5502",
    name: "Private pilot update",
    content: "WhatsApp and email update for the first pilot users.",
    status: "Pending",
    priority: "Medium",
    date: "Aug 9, 2026",
  },
  {
    id: "COM-5503",
    name: "Launch positioning",
    content: "Message focused on visibility, uptime, and installer trust.",
    status: "Resolved",
    priority: "Low",
    date: "Aug 5, 2026",
  },
];

export const SUPER_ADMIN_FILTER_OPTIONS = {
  status: ["All", "Open", "In Progress", "Resolved", "Active", "Pending"],
  priority: ["All", "Low", "Medium", "High"],
  date: ["All", "Last Month", "Last 3 Months", "Last 6 Months", "Last Year"],
  role: ["All", "Admin", "Super Admin"],
  plan: ["All", "Free", "Pilot", "Installer referral"],
};

export const SUPER_ADMIN_OVERVIEW_CHARTS = [
  {
    title: "Free vs Paid Users",
    value: "354 free / 12 paid",
    icon: BarChart3,
    input: [12, 18, 28, 46, 80, 64, 52, 48, 36],
    output: [4, 6, 8, 12, 18, 16, 14, 18, 12],
  },
  {
    title: "AI Credit Consumption",
    value: "30,212,186",
    icon: Bell,
    input: [10, 28, 52, 48, 42, 38, 54, 82, 50],
    output: [6, 18, 36, 32, 28, 24, 34, 58, 30],
  },
  {
    title: "Installer Pipeline",
    value: "24 partner leads",
    icon: Headphones,
    input: [8, 12, 18, 20, 26, 34, 30, 38, 44],
    output: [4, 8, 10, 12, 18, 22, 20, 24, 28],
  },
];
