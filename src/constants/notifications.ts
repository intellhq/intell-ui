import { BatteryLow, CircleHelp, Sun, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export const ALERT_ROWS = [
  {
    id: "battery_low",
    icon: BatteryLow,
    title: "Battery Low Warning",
    description: "Alerts when battery falls below selected threshold",
  },
  {
    id: "predictive_depletion",
    icon: CircleHelp,
    title: "Predictive Battery Depletion",
    description: "AI predicts battery may run out soon",
  },
  {
    id: "panel_underperformance",
    icon: Sun,
    title: "Panel Underperformance",
    description: "Detects low solar generation or shading issues",
  },
  {
    id: "load_spike",
    icon: TrendingUp,
    title: "Load Spike Detection",
    description: "Detects unusual appliance power consumption",
  },
] as const;


export const DELIVERY_CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Verify your phone to enable",
    defaultChecked: false,
  },
  {
    id: "email",
    label: "Email",
    get description(): string {
      return useAuthStore.getState().user?.email || "contact@intell.ng";
    },
    defaultChecked: true,
    verified: true,
  },
  {
    id: "in_app",
    label: "In-App Notifications",
    description: "Push to mobile and web app",
    defaultChecked: true,
  },
];
