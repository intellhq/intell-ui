export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  onboardingComplete?: boolean;
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  profilePhoto?: string;
  profileUrl?: string;
  businessName?: string;
  businessType?: string;
  state?: string;
  city?: string;
  aiLanguage?: string;
  role?: string;
}

export interface InverterAccess {
  inverterId: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  sessionId: string;
  user: User;
  inverterAccess: InverterAccess[];
}

export interface RegisterResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyEmailResponse {
  accessToken?: string;
  sessionId?: string;
  user: User;
  inverterAccess?: InverterAccess[];
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface MeResponse {
  user: User;
  inverterAccess: InverterAccess[];
}
