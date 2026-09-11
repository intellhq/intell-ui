"use client";

import { PiggyBank, Leaf, Clock, Fuel } from "lucide-react";
import { TrackerCard } from "./primitives";
import type { TrackerCardData } from "./primitives";
import { CumulativeSavingsChart } from "./cumulative-savings-chart";
import { SavingsTrendsAnalytics } from "./savings-trends-analytics";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import type { CumulativeSavingsData } from "@/types/inverter";

const toNumber = (value: unknown) => {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 0;

  return Number.isFinite(numericValue) ? numericValue : 0;
};

function normalizeCumulativeSavingsData(
  data: CumulativeSavingsData | null | undefined,
): CumulativeSavingsData {
  return {
    lifetimeSavingsNgn: toNumber(data?.lifetimeSavingsNgn),
    lifetimeEnergyKwh: toNumber(data?.lifetimeEnergyKwh),
    lifetimeFuelSavedLitres: toNumber(data?.lifetimeFuelSavedLitres),
    co2AvoidedKg: toNumber(data?.co2AvoidedKg),
    generatorHoursAvoided: toNumber(data?.generatorHoursAvoided),
    totalSavingsToDateNgn: toNumber(data?.totalSavingsToDateNgn),
    averageMonthlySavingsNgn: toNumber(data?.averageMonthlySavingsNgn),
    chart: (data?.chart ?? []).map((point) => ({
      ...point,
      savingsNgn: toNumber(point.savingsNgn),
    })),
    meta: data?.meta ?? {
      fuelType: "",
      fuelPricePerLitreNgn: 0,
      fuelPriceLastUpdated: "",
      assumedGeneratorRatedPowerKw: 0,
      assumedConsumptionRateLPerHr: 0,
    },
  };
}

function formatCurrency(val: number) {
  if (val >= 1_000_000) {
    return `₦${(val / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  }
  if (val >= 1_000) {
    return `₦${(val / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `₦${val.toLocaleString()}`;
}

function formatCo2(kg: number) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1).replace(/\.0$/, "")} Tons`;
  }
  return `${kg.toFixed(0)} Kg`;
}

function formatNumber(val: number, unit: string) {
  if (val >= 1_000_000_000) {
    return `${(val / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B ${unit}`;
  }
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1).replace(/\.0$/, "")}M ${unit}`;
  }
  if (val >= 10_000) {
    return `${(val / 1_000).toFixed(1).replace(/\.0$/, "")}k ${unit}`;
  }
  return `${val.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;
}

function TrackerPanelSkeleton() {
  return (
    <div className="w-full min-w-0 overflow-hidden animate-pulse">
      {/* 4 Cards Skeleton */}
      <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6.75">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col rounded-lg border bg-card border-border pb-4 h-[120px] p-4 justify-between">
            <div className="flex justify-between items-center">
              <div className="w-9 h-9 bg-muted rounded-md animate-pulse" />
              <div className="w-12 h-4 bg-muted rounded-sm animate-pulse" />
            </div>
            <div>
              <div className="w-24 h-8 bg-muted rounded animate-pulse" />
              <div className="w-28 h-3 bg-muted rounded mt-2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Trends Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start mt-8">
        <div className="flex flex-col rounded-[8.87px] border bg-card w-full lg:flex-1 p-4 sm:p-6 lg:p-[26.61px] border-border h-[400px]">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded mt-2 animate-pulse" />
          <div className="h-full bg-muted rounded mt-8 animate-pulse" />
        </div>
        <div className="flex flex-col w-full lg:w-95.25 lg:shrink-0 space-y-4">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded mt-2 animate-pulse" />
          <div className="h-[132px] bg-muted rounded border border-border mt-4 animate-pulse" />
          <div className="h-[132px] bg-muted rounded border border-border animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CumulativeTrackerPanel() {
  const { useUserInverters, useCumulativeSavings } = useInverterQueries();
  const { data: inverters, isLoading: invertersLoading } = useUserInverters();
  const inverterId = inverters?.[0]?.id;

  const { data: cumulativeData, isLoading: cumulativeLoading } = useCumulativeSavings(inverterId);

  if (invertersLoading || cumulativeLoading) {
    return <TrackerPanelSkeleton />;
  }

  const data = normalizeCumulativeSavingsData(cumulativeData);

  const chartPoints = data.chart || [];
  let savingsGrowthBadge: string | undefined = undefined;
  let savingsGrowthBadgeColor = "var(--color-success-alt)";
  let savingsGrowthBadgeBg = "var(--color-chart-battery)";

  if (chartPoints.length >= 2) {
    const latest = chartPoints[chartPoints.length - 1].savingsNgn;
    const prev = chartPoints[chartPoints.length - 2].savingsNgn;
    if (prev > 0) {
      const pct = ((latest - prev) / prev) * 100;
      const isPositive = pct >= 0;
      savingsGrowthBadge = `${isPositive ? "+" : ""}${pct.toFixed(0)}%`;
      savingsGrowthBadgeColor = isPositive ? "var(--color-success-alt)" : "var(--color-coral-50)";
      savingsGrowthBadgeBg = isPositive ? "var(--color-chart-battery)" : "var(--color-coral-10)";
    }
  }

  const badgeProps = savingsGrowthBadge
    ? {
        badge: savingsGrowthBadge,
        badgeBg: savingsGrowthBadgeBg,
        badgeColor: savingsGrowthBadgeColor,
      }
    : {
        badge: undefined,
        badgeBg: undefined,
        badgeColor: undefined,
      };

  const trackerCards: TrackerCardData[] = [
    {
      icon: PiggyBank,
      iconColor: "var(--color-primary)",
      iconBg: "var(--color-nav-active-bg)",
      ...badgeProps,
      label: "LIFETIME SAVINGS",
      value: formatCurrency(data.lifetimeSavingsNgn),
    },
    {
      icon: Leaf,
      iconColor: "var(--color-battery-full)",
      iconBg: "var(--color-success-bg)",
      label: "CO2 AVOIDED",
      value: formatCo2(data.co2AvoidedKg),
    },
    {
      icon: Clock,
      iconColor: "var(--color-chart-diesel)",
      iconBg: "var(--color-amber-bg-light)",
      label: "GEN HOURS AVOIDED",
      value: formatNumber(data.generatorHoursAvoided, "hrs"),
    },
    {
      icon: Fuel,
      iconColor: "var(--color-coral-50)",
      iconBg: "var(--color-coral-10)",
      label: "FUEL SAVED",
      value: formatNumber(data.lifetimeFuelSavedLitres, "Litres"),
    },
  ];

  return (
    <section
      aria-label="Cumulative tracker"
      className="w-full min-w-0 overflow-hidden"
    >
      <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6.75">
        {trackerCards.map((card) => (
          <TrackerCard key={card.label} {...card} />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-start mt-8">
        <CumulativeSavingsChart chart={chartPoints} />
        <SavingsTrendsAnalytics
          totalSavingsToDateNgn={data.totalSavingsToDateNgn}
          averageMonthlySavingsNgn={data.averageMonthlySavingsNgn}
          chart={chartPoints}
        />
      </div>
    </section>
  );
}
