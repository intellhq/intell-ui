import { apiFetch } from "@/lib/api/client";

export type UserFeedbackPriority = "low" | "medium" | "high";

export interface SubmitUserFeedbackPayload {
  category: string;
  priority: UserFeedbackPriority;
  message: string;
}

export const UserFeedbackService = {
  submit: (data: SubmitUserFeedbackPayload) =>
    apiFetch<void>("/feedback", { method: "POST", data }, true),
};
