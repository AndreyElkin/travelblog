// API Types

export interface User {
  id: number;
  email: string;
  full_name: string;
  photo?: string;
  city?: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}

export interface Post {
  id: number;
  title: string;
  description?: string;
  excerpt?: string;
  country?: string;
  county?: string;
  city: string;
  image?: string;
  photo?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PostsResponse {
  data: Post[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Comment {
  id: number;
  post_id: number;
  name: string;
  text: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserRequest {
  full_name: string;
  city?: string;
  bio?: string;
  photo?: File | string;
}

export interface UpdatePasswordRequest {
  password: string;
  password_confirmation: string;
}
