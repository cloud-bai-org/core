import type { AuthUser } from '~/types/auth'

const LINE_AUTH_URL = 'https://access.line.me/oauth2/v2.1/authorize'
const LINE_PROFILE_URL = 'https://api.line.me/v2/profile'

export function getLineAuthUrl(channelId: string, redirectUri: string): string {
  const state = Math.random().toString(36).substring(2)
  if (import.meta.client) {
    sessionStorage.setItem('line_oauth_state', state)
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: channelId,
    redirect_uri: redirectUri,
    state,
    scope: 'profile openid',
  })
  return `${LINE_AUTH_URL}?${params.toString()}`
}

export async function handleLineCallback(
  code: string,
  state: string,
  redirectUri: string,
): Promise<{ user: AuthUser; token: string }> {
  if (import.meta.client) {
    const savedState = sessionStorage.getItem('line_oauth_state')
    if (savedState !== state) {
      throw new Error('Invalid OAuth state')
    }
    sessionStorage.removeItem('line_oauth_state')
  }

  const tokenResponse = await $fetch<{
    access_token: string
    id_token: string
  }>('/api/auth/line/token', {
    method: 'POST',
    body: { code, redirectUri },
  })

  const profile = await $fetch<{
    userId: string
    displayName: string
    pictureUrl?: string
  }>(LINE_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  })

  return {
    user: {
      id: profile.userId,
      name: profile.displayName,
      avatar: profile.pictureUrl,
      provider: 'line',
    },
    token: tokenResponse.id_token,
  }
}
