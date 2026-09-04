const GLOBAL_KEY = "intell_onboarding_completed";

export const onboardingStorage = {
  getCompletionKey: (userId?: string) => {
    return userId ? `intell_onboarding_completed_${userId}` : GLOBAL_KEY;
  },

  isCompleted: (userId?: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const key = onboardingStorage.getCompletionKey(userId);
      return localStorage.getItem(key) === "true";
    } catch (e) {
      console.warn("Storage access failed (possibly incognito mode):", e);
      return false;
    }
  },

  setCompleted: (userId?: string): void => {
    if (typeof window === "undefined") return;
    try {
      const key = onboardingStorage.getCompletionKey(userId);
      localStorage.setItem(key, "true");
      if (!userId) localStorage.setItem(GLOBAL_KEY, "true");
    } catch (e) {
      console.warn("Failed to save onboarding completion (possibly incognito mode):", e);
    }
  },

  clearCompletion: (userId?: string): void => {
    if (typeof window === "undefined") return;
    try {
      const key = onboardingStorage.getCompletionKey(userId);
      localStorage.removeItem(key);
      if (!userId) localStorage.removeItem(GLOBAL_KEY);
    } catch (e) {
      console.warn("Failed to clear onboarding completion (possibly incognito mode):", e);
    }
  }
};
