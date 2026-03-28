import type { AuthUser } from '~/types/auth'
import { handleGoogleCallback } from './google-auth'
import { handleLineCallback } from './line-auth'

export interface AuthResult {
  user: AuthUser
  token: string
}

export async function authenticateWithGoogle(
  code: string,
  redirectUri: string,
): Promise<AuthResult> {
  return await handleGoogleCallback(code, redirectUri)
}

export async function authenticateWithLine(
  code: string,
  state: string,
  redirectUri: string,
): Promise<AuthResult> {
  return await handleLineCallback(code, state, redirectUri)
}

export { getGoogleAuthUrl } from './google-auth'
export { getLineAuthUrl } from './line-auth'
