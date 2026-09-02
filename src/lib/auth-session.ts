import { AuthService } from "@/services/auth-service";
import { ApiError } from "@/lib/api/error";
import { useAuthStore } from "@/stores/auth-store";
import type { RefreshTokenResponse } from "@/types/auth";

export type RefreshSessionResult =
  | { ok: true }
  | { ok: false; status?: number; message?: string };

export function resetAuthForOAuthCallback(): void {
  useAuthStore.getState().clearClientAuth();
}

function applyRefreshResponse(data: RefreshTokenResponse) {
  const { setTokensLocal } = useAuthStore.getState();
  setTokensLocal(data.accessToken);
}

export async function refreshAuthSession(): Promise<RefreshSessionResult> {
  if (typeof window === "undefined") {
    return { ok: false, message: "Refresh is only available in the browser." };
  }

  const { sessionId, setSessionId } = useAuthStore.getState();
  if (!sessionId) {
    return { ok: false, status: 401, message: "Missing sessionId." };
  }

  try {
    const data = await AuthService.refresh({ sessionId });

    if (!data?.accessToken) {
      return {
        ok: false,
        status: 502,
        message: "Refresh response is missing an access token.",
      };
    }

    applyRefreshResponse(data);
    setSessionId(sessionId);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: error instanceof ApiError ? error.status : 500,
      message: error instanceof Error ? error.message : "Refresh failed.",
    };
  }
}
