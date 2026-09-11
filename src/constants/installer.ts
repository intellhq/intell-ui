import type { Alert } from "@/types/alerts";

export type InstallerDashboardStatus = "Healthy" | "Needs attention" | "Offline";

export interface InstallerConnectedDashboard {
  id: string;
  ownerName: string;
  siteName: string;
  location: string;
  inverter: string;
  accessLevel: "Dashboard + alerts";
  status: InstallerDashboardStatus;
  solarInputKw: number;
  batteryPercent: number;
  runningLoadKw: number;
  openAlerts: number;
  lastUpdated: string;
  addedBy: string;
}

export const installerProfile = {
  name: "Tunde Adewale",
  email: "contact@intell.ng",
  phone: "+234 808 111 2045",
  company: "Adewale Solar Works",
  role: "Installer",
  serviceArea: "Lagos and Ogun",
  installerType: "Independent technician",
};

export const installerDashboards: InstallerConnectedDashboard[] = [
  {
    id: "adebayo-residence",
    ownerName: "Daphne Luna",
    siteName: "Daphne Luna Residence",
    location: "Lekki, Lagos",
    inverter: "Deye hybrid inverter",
    accessLevel: "Dashboard + alerts",
    status: "Healthy",
    solarInputKw: 4.2,
    batteryPercent: 74,
    runningLoadKw: 2.8,
    openAlerts: 1,
    lastUpdated: "2 min ago",
    addedBy: "Daphne Luna",
  },
  {
    id: "greenbite-kitchen",
    ownerName: "Greenbite Kitchen",
    siteName: "Greenbite Kitchen Cold Room",
    location: "Yaba, Lagos",
    inverter: "Growatt SPF 5000ES",
    accessLevel: "Dashboard + alerts",
    status: "Needs attention",
    solarInputKw: 2.6,
    batteryPercent: 28,
    runningLoadKw: 3.4,
    openAlerts: 3,
    lastUpdated: "8 min ago",
    addedBy: "Amaka Okoro",
  },
  {
    id: "northgate-office",
    ownerName: "Northgate Office",
    siteName: "Northgate Office Backup System",
    location: "Ikeja, Lagos",
    inverter: "Luxpower SNA 5kW",
    accessLevel: "Dashboard + alerts",
    status: "Healthy",
    solarInputKw: 5.1,
    batteryPercent: 81,
    runningLoadKw: 3.1,
    openAlerts: 0,
    lastUpdated: "5 min ago",
    addedBy: "Northgate Admin",
  },
  {
    id: "habiba-store",
    ownerName: "Habiba Store",
    siteName: "Habiba Store Solar System",
    location: "Abeokuta, Ogun",
    inverter: "MUST Power PV1800",
    accessLevel: "Dashboard + alerts",
    status: "Offline",
    solarInputKw: 0,
    batteryPercent: 16,
    runningLoadKw: 0,
    openAlerts: 2,
    lastUpdated: "1 hr ago",
    addedBy: "Habiba Yusuf",
  },
];

export const installerAlerts: Record<string, Alert[]> = {
  "adebayo-residence": [
    {
      id: "installer-alert-1",
      title: "Battery reserve approaching threshold",
      subtitle: "Battery is at 23% and evening load is rising",
      severity: "warning",
      status: "unresolved",
      time: "Today, 6:10 pm",
      sortTime: "2026-08-12T18:10:00.000Z",
      iconType: "battery_low",
      modalDetail: {
        metrics: [
          { label: "Battery SOC", value: "23%" },
          { label: "Load", value: "2.8 kW" },
          { label: "Solar input", value: "4.2 kW" },
        ],
        reason:
          "The site is drawing more evening load than usual. Ask the owner to reduce non-critical load or inspect battery reserve settings.",
      },
    },
  ],
  "greenbite-kitchen": [
    {
      id: "installer-alert-2",
      title: "Cold room load is above normal",
      subtitle: "Load stayed above 3.2 kW for 90 minutes",
      severity: "critical",
      status: "unresolved",
      time: "Today, 3:20 pm",
      sortTime: "2026-08-12T15:20:00.000Z",
      iconType: "power_high",
    },
    {
      id: "installer-alert-3",
      title: "Battery draining faster than forecast",
      subtitle: "Battery dropped 18% in the last hour",
      severity: "warning",
      status: "unresolved",
      time: "Today, 2:42 pm",
      sortTime: "2026-08-12T14:42:00.000Z",
      iconType: "battery_low",
    },
    {
      id: "installer-alert-4",
      title: "Solar generation below expected range",
      subtitle: "Possible shading or panel underperformance",
      severity: "warning",
      status: "resolved",
      time: "Yesterday, 11:30 am",
      sortTime: "2026-08-11T11:30:00.000Z",
      iconType: "solar",
    },
  ],
  "northgate-office": [
    {
      id: "installer-alert-5",
      title: "System health check passed",
      subtitle: "Battery, grid, and solar readings are within range",
      severity: "success",
      status: "no_action_needed",
      time: "Today, 10:00 am",
      sortTime: "2026-08-12T10:00:00.000Z",
      iconType: "check",
    },
  ],
  "habiba-store": [
    {
      id: "installer-alert-6",
      title: "Inverter logger offline",
      subtitle: "No telemetry received for 54 minutes",
      severity: "critical",
      status: "unresolved",
      time: "Today, 5:12 pm",
      sortTime: "2026-08-12T17:12:00.000Z",
      iconType: "clock",
    },
    {
      id: "installer-alert-7",
      title: "Battery critically low",
      subtitle: "Charge level at 16%",
      severity: "warning",
      status: "unresolved",
      time: "Today, 4:58 pm",
      sortTime: "2026-08-12T16:58:00.000Z",
      iconType: "battery_low",
    },
  ],
};

export function getInstallerDashboard(id: string) {
  return installerDashboards.find((dashboard) => dashboard.id === id);
}
