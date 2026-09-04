import {
  SavingsSetupPreferencesSchema,
  type SavingsSetupPreferences,
} from "@/types/savings-setup";

const STORAGE_PREFIX = "intell_savings_setup";

function getKey(userId?: string) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
}

export const savingsSetupStorage = {
  get(userId?: string): SavingsSetupPreferences | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(getKey(userId));
      if (!raw) return null;
      const parsed = SavingsSetupPreferencesSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  },

  save(prefs: SavingsSetupPreferences, userId?: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(getKey(userId), JSON.stringify(prefs));
    } catch (e) {
      console.warn("Failed to save savings setup preferences:", e);
    }
  },

  clear(userId?: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(getKey(userId));
    } catch (e) {
      console.warn("Failed to clear savings setup preferences:", e);
    }
  },

  hasCompletedSetup(userId?: string): boolean {
    const prefs = savingsSetupStorage.get(userId);
    return Boolean(prefs?.updatedAt);
  },
};
