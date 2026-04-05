import type { User, Session } from '@supabase/supabase-js'

export function useSupabaseAuth() {
  const { $supabase } = useNuxtApp()
  const user = useState<User | null>('supabase-user', () => null)
  const session = useState<Session | null>('supabase-session', () => null)

  const isLoggedIn = computed(() => !!session.value)
  const token = computed(() => session.value?.access_token ?? null)

  async function init() {
    if (!$supabase) return

    const { data } = await $supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null

    $supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  async function signOut() {
    if (!$supabase) return
    await $supabase.auth.signOut()
  }

  return {
    user: readonly(user),
    session: readonly(session),
    isLoggedIn,
    token,
    init,
    signOut,
  }
}
