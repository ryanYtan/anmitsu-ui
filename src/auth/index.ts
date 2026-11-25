import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { ErrorResponse, type UserManager } from 'oidc-client-ts'
import { useAuth } from 'react-oidc-context'

// A token this close to running out is renewed here (the sign-in library itself renews a minute before).
const DUE_SECONDS = 2 * 60
const RETRY_MS = 30 * 1000

// Needs oidc-client-ts and react-oidc-context in the app.

/**
 * Keeps the user signed in for as long as the refresh token lasts (30 days in the shared pool). The sign-in library
 * renews the access token a minute before it runs out, but only while the page is running, and if that one request
 * fails (a phone waking up without a network yet) it never tries again; the token then lapses and every request is
 * refused. So the token is also renewed here: at start-up if it ran out while the app was closed, whenever the page
 * comes back into view or online, and every half minute after a failure. Only Cognito refusing the refresh token
 * (expired, revoked, or the account no longer in the app's group) signs the user out.
 *
 * It calls the library's UserManager directly, because react-oidc-context's wrappers swallow its errors.
 * Returns true until the start-up renewal has been answered, while the app counts as still signing in.
 */
export function useRenewal(userManager: UserManager) {
  const auth = useAuth()
  const [starting, setStarting] = useState(true)
  const running = useRef(false)
  const retry = useRef<number>(undefined)
  // Bumped to try again after a failure.
  const [attempt, setAttempt] = useState(0)
  const tryLater = () => {
    window.clearTimeout(retry.current)
    retry.current = window.setTimeout(() => setAttempt(n => n + 1), RETRY_MS)
  }

  const renew = useEffectEvent(async () => {
    const user = auth.user
    if (running.current || auth.isLoading || !user?.refresh_token || user.expires_in === undefined || user.expires_in > DUE_SECONDS) return
    running.current = true
    try {
      await userManager.signinSilent()
    } catch (error) {
      if (error instanceof ErrorResponse) await userManager.removeUser()
      else tryLater()
    } finally {
      running.current = false
      setStarting(false)
    }
  })

  // At start-up, whenever the stored sign-in changes, and on each retry. With nothing to renew, start-up is over at once.
  const userKey = auth.isLoading ? undefined : `${auth.user?.expires_at}:${auth.user?.refresh_token !== undefined}`
  useEffect(() => {
    if (userKey === undefined) return
    void renew()
    if (!running.current) setStarting(false)
  }, [userKey, attempt])

  useEffect(() => {
    const onWake = () => document.visibilityState === 'visible' && void renew()
    document.addEventListener('visibilitychange', onWake)
    window.addEventListener('online', onWake)
    window.addEventListener('pageshow', onWake)
    userManager.events.addSilentRenewError(tryLater)
    return () => {
      document.removeEventListener('visibilitychange', onWake)
      window.removeEventListener('online', onWake)
      window.removeEventListener('pageshow', onWake)
      userManager.events.removeSilentRenewError(tryLater)
      window.clearTimeout(retry.current)
    }
  }, [userManager])

  return starting
}
