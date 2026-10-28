import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  Company,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RegisterPayload,
} from '../types/auth';
import { ApiError } from './apiError';
import { httpClient } from './httpClient';

/** Every authentication call the frontend can make. Failures always surface as ApiError. */
export class AuthApi {
  constructor(private readonly client: AxiosInstance) {}

  register(payload: RegisterPayload): Promise<MessageResponse> {
    return this.unwrap(this.client.post<MessageResponse>('/auth/register', payload));
  }

  resendVerification(email: string): Promise<MessageResponse> {
    return this.unwrap(this.client.post<MessageResponse>('/auth/resend-verification', { email }));
  }

  login(payload: LoginPayload): Promise<LoginResponse> {
    return this.unwrap(this.client.post<LoginResponse>('/auth/login', payload));
  }

  logout(): Promise<MessageResponse> {
    return this.unwrap(this.client.post<MessageResponse>('/auth/logout'));
  }

  async getProfile(): Promise<Company> {
    const { company } = await this.unwrap(this.client.get<{ company: Company }>('/auth/me'));
    return company;
  }

  private async unwrap<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      return (await request).data;
    } catch (error) {
      throw ApiError.from(error);
    }
  }
}

export const authApi = new AuthApi(httpClient);
