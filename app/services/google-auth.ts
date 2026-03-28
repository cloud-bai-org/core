import type { AuthUser } from '~/types/auth'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

export function getGoogleAuthUrl(clientId: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
  })
  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export async function handleGoogleCallback(
  code: string,
  redirectUri: string,
): Promise<{ user: AuthUser; token: string }> {
  const tokenResponse = await $fetch<{
    access_token: string
    id_token: string
  }>('/api/auth/google/token', {
    method: 'POST',
    body: { code, redirectUri },
  })

  const userInfo = await $fetch<{
    sub: string
    name: string
    picture: string
    email: string
  }>(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  })

  return {
    user: {
      id: userInfo.sub,
      name: userInfo.name,
      avatar: userInfo.picture,
      email: userInfo.email,
      provider: 'google',
    },
    token: tokenResponse.id_token,
  }
}
