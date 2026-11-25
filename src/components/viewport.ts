import { useSyncExternalStore } from 'react'

// On phones the on-screen keyboard and the browser's toolbars cover part of the page without making it any shorter:
// only the visual viewport shrinks (and pans). Anything fixed to the bottom of the page then sits behind the keyboard,
// and iOS shows it only while a scroll is under way. This follows the part that is actually visible, so a full-screen
// dialog can fit it and keep its buttons in view, just above the keyboard.

const subscribe = (onChange: () => void) => {
  const viewport = window.visualViewport
  viewport?.addEventListener('resize', onChange)
  viewport?.addEventListener('scroll', onChange)
  return () => {
    viewport?.removeEventListener('resize', onChange)
    viewport?.removeEventListener('scroll', onChange)
  }
}

// A string, so that the same area is the same snapshot and nothing re-renders until it changes.
const snapshot = () => {
  const viewport = window.visualViewport
  return viewport ? `${viewport.offsetTop} ${viewport.height}` : ''
}

/** Where the visible part of the page starts (from the top of the page's fixed-position box) and how tall it is; undefined where browsers cannot tell. */
export function useVisibleArea(): { top: number; height: number } | undefined {
  const area = useSyncExternalStore(subscribe, snapshot, () => '')
  if (!area) return undefined
  const [top, height] = area.split(' ').map(Number)
  return { top, height }
}
