export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_image?: string | null;
  profile_image_url?: string | null;
  created_at: string;
}

export interface AuthPayload {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}
