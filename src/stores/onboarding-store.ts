import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type OnboardingStep = "select" | "connect";

interface OnboardingState {
  step: OnboardingStep;
  inverterType: string | null;
  connectionDetails: Record<string, string[]>; // Maps inverter type to field values
  
  setStep: (step: OnboardingStep) => void;
  setInverterType: (type: string | null) => void;
  setConnectionDetails: (type: string, values: string[]) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: "select",
      inverterType: null,
      connectionDetails: {},
      
      setStep: (step) => set({ step }),
      setInverterType: (inverterType) => set({ inverterType }),
      setConnectionDetails: (type, values) => 
        set((state) => ({
          connectionDetails: {
            ...state.connectionDetails,
            [type.toLowerCase()]: values,
          }
        })),
      resetOnboarding: () => set({ 
        step: "select", 
        inverterType: null, 
        connectionDetails: {} 
      }),
    }),
    {
      name: "intell-onboarding",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        step: state.step,
        inverterType: state.inverterType,
      }),
    }
  )
);
