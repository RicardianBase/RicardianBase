import client from './client';
import type { AuthResponse } from '@/types/api';

export const requestNonce = (
  walletAddress: string,
  provider: 'phantom' | 'metamask' | 'coinbase',
) =>
  client
    .post<{ data: { nonce: string; message: string } }>('/auth/nonce', {
      walletAddress,
      provider,
    })
    .then((r) => r.data.data);

export const verifySignature = (
  walletAddress: string,
  signature: string,
  provider: 'phantom' | 'metamask' | 'coinbase',
) =>
  client
    .post<{ data: AuthResponse }>('/auth/verify', {
      walletAddress,
      signature,
      provider,
    })
    .then((r) => r.data.data);

export const refreshTokenApi = (refreshToken: string) =>
  client
    .post<{ data: { accessToken: string; refreshToken: string } }>(
      '/auth/refresh',
      { refreshToken },
    )
    .then((r) => r.data.data);
