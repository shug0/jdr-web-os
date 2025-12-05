'use client'

import { useSearchParams } from 'next/navigation'

export function useStandaloneMode() {
  const searchParams = useSearchParams()
  return searchParams?.get('mode') === 'standalone'
}