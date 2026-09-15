"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InverterCard } from "./inverter-card";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { trackEvent } from "@/lib/analytics";
import { useOnboardingStore } from "@/stores/onboarding-store";

export type InverterType = string;

interface InverterTypeStepProps {
  onNext: () => void;
  onCancel?: () => void;
}

export function InverterTypeStep({
  onNext,
  onCancel,
}: InverterTypeStepProps) {
  const { inverterType: selected, setInverterType: onSelect } = useOnboardingStore();
  const { useSupportedBrands } = useInverterQueries();
  const { data: brandsResponse, isLoading, error } = useSupportedBrands();

  useEffect(() => {
    trackEvent("Screen View", { screen_name: "Inverter Type Selection" });
  }, []);

  const handleNext = () => {
    trackEvent("Next Button Clicked", { screen_name: "Inverter Type Selection", selected_inverter: selected });
    onNext();
  };

  const handleCancel = () => {
    trackEvent("Back Button Clicked", { screen_name: "Inverter Type Selection" });
    if (onCancel) onCancel();
  };

  const brands = Array.isArray(brandsResponse) ? brandsResponse : [];

  const getSubTitle = (brandName: string) => {
    switch (brandName.toUpperCase()) {
      case "VICTRON":
        return "Vrm OAuth";
      case "SANDBOX":
        return "Mock Connection";
      default:
        return "API key";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        Failed to load supported brands. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
        {brands.map((brandName) => (
          <InverterCard
            key={brandName}
            title={
              brandName.charAt(0).toUpperCase() +
              brandName.slice(1).toLowerCase()
            }
            subtitle={getSubTitle(brandName)}
            selected={selected === brandName}
            onSelect={() => {
              onSelect(brandName);
              trackEvent("Inverter Type Selected", {
                inverter_type: brandName,
              });
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-14 w-full cursor-pointer rounded-lg border-foreground/20 text-base font-medium sm:max-w-61.75 lg:text-lg"
          >
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleNext}
          disabled={!selected}
          className="h-14 w-full cursor-pointer rounded-lg bg-[#111827] text-base font-medium text-white hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#E8E8E8] disabled:text-[#2A2F3C] disabled:opacity-100 sm:max-w-61.75 lg:text-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
