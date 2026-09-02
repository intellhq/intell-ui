import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiError } from "./error";
// import { env as serverEnv } from "@/env/server";
import { refreshAuthSession } from "@/lib/auth-session";
import { useAuthStore } from "@/stores/auth-store";
import { AUTH_PUBLIC_PATHS } from "@/constants/auth";
import { RefreshTokenResponse } from "@/types/auth";

const isAbsoluteUrl = (path: string): boolean => /^https?:\/\//i.test(path);
const isInternalApiPath = (path: string): boolean => path.startsWith("/api/");
const isServer = typeof window === "undefined";

if (!isServer) {
  // Ensure browser requests send cookies (HttpOnly token cookie)
  axios.defaults.withCredentials = true;
}

let refreshingPromise: Promise<RefreshTokenResponse> | null = null;
let authRedirectInFlight = false;

function redirectToLoginOnce() {
  if (typeof window === "undefined" || authRedirectInFlight) return;
  authRedirectInFlight = true;
  window.location.replace("/login");
}

function handleSessionRefreshFailure(): never {
  useAuthStore.getState().logout();
  redirectToLoginOnce();
  throw new ApiError("Your session has expired. Please sign in again.", 401);
}

function getRefreshPromise(): Promise<RefreshTokenResponse> {
  if (!refreshingPromise) {
    refreshingPromise = refreshAuthSession()
      .then((result) => {
        if (!result.ok) {
          if (result.status === 401) {
            throw new ApiError(
              result.message || "Your session has expired. Please sign in again.",
              401,
            );
          }

          throw new ApiError(
            result.message || "Unable to refresh session right now.",
            result.status ?? 500,
          );
        }
        const { token } = useAuthStore.getState();
        if (!token) {
          throw new Error("Session refresh missing tokens");
        }
        return {
          accessToken: token,
        } satisfies RefreshTokenResponse;
      })
      .finally(() => {
        refreshingPromise = null;
      });
  }

  return refreshingPromise;
}

function getBaseUrl(): string | undefined {
  return isServer
    ? process.env.API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy";
}

const normalizeBackendPath = (path: string): string => {
  const base = getBaseUrl() || "http://localhost:3000";
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedPath}`;
};

const resolveRequestUrl = (path: string, proxy?: boolean): string => {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  // On the server, hit the backend directly instead of through the proxy
  if (proxy && !isServer) {
    const normalizedPath = path.replace(/^\/+/, "");
    return `/api/proxy/${normalizedPath}`;
  }

  if (isInternalApiPath(path)) {
    // On the server, internal API paths need the full origin
    if (isServer) {
      const host = getBaseUrl() || "http://localhost:3000";
      return `${host}${path}`;
    }
    return path;
  }

  if (!getBaseUrl()) {
    throw new Error("API_BASE_URL is not defined");
  }

  return normalizeBackendPath(path);
};

const isAuthEndpoint = (path: string): boolean => {
  const normalized = path.replace(/^\/+/, "").replace(/^api\/proxy\//, "");
  return AUTH_PUBLIC_PATHS.some((p) => {
    const trimmedP = p.replace(/^\/+/, "");
    return normalized === trimmedP || normalized.startsWith(trimmedP + "/");
  });
};

export async function apiFetch<TResponse>(
  path: string,
  config: AxiosRequestConfig = {},
  proxy?: boolean,
): Promise<TResponse> {
  const headers: Record<string, string> = {
    ...((config.headers as Record<string, string>) || {}),
  };

  const isJson =
    config.data &&
    !(config.data instanceof FormData) &&
    !(config.data instanceof Blob);

  if (!headers["Content-Type"] && isJson) {
    headers["Content-Type"] = "application/json";
  }

  // Backend expects Bearer auth; cookies alone are not accepted on API routes.
  if (!isServer && !headers["Authorization"] && !isAuthEndpoint(path)) {
    const { token } = useAuthStore.getState();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (useAuthStore.getState().isAuthenticated) {
      try {
        const refreshData = await getRefreshPromise();
        headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          handleSessionRefreshFailure();
        }
        throw error;
      }
    }
  }

  const url = resolveRequestUrl(path, proxy);
  const axiosInstance =
    proxy || isInternalApiPath(url) || !isServer
      ? axios
      : axios.create({
          baseURL: getBaseUrl(),
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 400,
        });

  try {
    const res = await axiosInstance.request({
      url,
      ...config,
      withCredentials: true,
      headers,
    });

    if (res.status === 204) {
      return undefined as TResponse;
    }

    if (
      res.data &&
      typeof res.data === "object" &&
      "success" in res.data &&
      "data" in res.data
    ) {
      return res.data.data as TResponse;
    }

    return res.data as TResponse;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response?.status ?? 500;
      const isRefreshPath = path.includes("/auth/refresh");

      if (
        status === 401 &&
        typeof window !== "undefined" &&
        !isAuthEndpoint(path) &&
        !isRefreshPath
      ) {
        try {
          const refreshData = await getRefreshPromise();
          // Retry the original request with new token
          const newHeaders = {
            ...headers,
            Authorization: `Bearer ${refreshData.accessToken}`,
          };
          return apiFetch<TResponse>(
            path,
            { ...config, headers: newHeaders },
            proxy,
          );
        } catch (error) {
          if (error instanceof ApiError && error.status !== 401) {
            throw error;
          }
        }

        // Clear auth tokens only when refresh definitively says the session is invalid.
        useAuthStore.getState().logout();
        redirectToLoginOnce();
      }

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred. Please try again.";
      throw new ApiError(message, status, err.response?.data);
    }
    throw new ApiError(
      err instanceof Error ? err.message : "An error occurred.",
      500,
    );
  }
}
