'use client'

import { useSearchParams } from 'next/navigation'

export function useWindowMode() {
  const searchParams = useSearchParams()
  return searchParams?.get('windowMode') === 'true'
}