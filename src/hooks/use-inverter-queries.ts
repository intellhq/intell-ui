import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { InverterService } from "@/services/inverter-service";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export const useInverterQueries = () => {
  const { isAuthenticated, token, user } = useAuthStore();
  const canFetchProtected = isAuthenticated && !!token;

  const queryClient = useQueryClient();

  const useSupportedBrands = () =>
    useQuery({
      queryKey: ["supported-brands"],
      queryFn: InverterService.getSupportedBrands,
      enabled: canFetchProtected,
      retry: false,
    });

  const useConnectInverter = (onSuccess?: () => void) =>
    useMutation({
      mutationFn: InverterService.connectInverter,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-inverters", user?.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["onboarding-status", user?.id],
        });

        toast.success("Inverter connected successfully!");
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : (error as { message?: string })?.message ||
              "Failed to connect inverter";
        toast.error(message);
      },
    });

  const useOnboardingStatus = () =>
    useQuery({
      queryKey: ["onboarding-status", user?.id],
      queryFn: InverterService.getOnboardingStatus,
      enabled: canFetchProtected && !!user?.id,
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 0,
    });

  const useUserInverters = () =>
    useQuery({
      queryKey: ["user-inverters", user?.id],
      queryFn: () => InverterService.getUserInverters(user!.id),
      enabled: canFetchProtected && !!user?.id,
      staleTime: 1000 * 60 * 5,
    });

  const useDashboardMetrics = (inverterId: string | undefined) =>
    useQuery({
      queryKey: ["dashboard-metrics", inverterId],
      queryFn: () => InverterService.getDashboardMetrics(inverterId!),
      enabled: canFetchProtected && !!inverterId,
    });

  const useEnergyUsage = (inverterId: string | undefined, period: string) =>
    useQuery({
      queryKey: ["energy-usage", inverterId, period],
      queryFn: () => InverterService.getEnergyUsage(inverterId!, period),
      enabled: canFetchProtected && !!inverterId,
      placeholderData: keepPreviousData,
    });

  const usePowerConsumption = (inverterId: string | undefined) =>
    useQuery({
      queryKey: ["power-consumption", inverterId],
      queryFn: () => InverterService.getPowerConsumption(inverterId!),
      enabled: canFetchProtected && !!inverterId,
    });

  const useCumulativeSavings = (inverterId: string | undefined) =>
    useQuery({
      queryKey: ["cumulative-savings", inverterId],
      queryFn: () => InverterService.getCumulativeSavings(inverterId!),
      enabled: canFetchProtected && !!inverterId,
    });

  return {
    useSupportedBrands,
    useConnectInverter,
    useOnboardingStatus,
    useUserInverters,
    useDashboardMetrics,
    useEnergyUsage,
    usePowerConsumption,
    useCumulativeSavings,
  };
};

