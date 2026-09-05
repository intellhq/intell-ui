import { apiFetch } from "@/lib/api/client";
import type { WaitlistLeadValues } from "@/lib/schemas/waitlist";

export const WaitlistService = {
  joinWaitlist: async (payload: string | WaitlistLeadValues) => {
    return apiFetch<void>(
      "/waitlist",
      {
        method: "POST",
        data: typeof payload === "string" ? { email: payload } : payload,
      },
      false,
    );
  },
};
