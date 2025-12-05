'use client'

import { useState, useEffect } from 'react'
import { appRegistry } from '../utils/app-registry'
import type { OSApp } from '../schemas'

export function useAppRegistry() {
  const [apps, setApps] = useState<OSApp[]>(() => appRegistry.getAll())

  useEffect(() => {
    const unsubscribe = appRegistry.subscribe(() => {
      setApps(appRegistry.getAll())
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const getApp = (appId: string) => appRegistry.get(appId)
  const getAppsByCategory = (category: OSApp['category']) => appRegistry.getByCategory(category)
  const searchApps = (query: string) => appRegistry.search(query)

  return {
    apps,
    getApp,
    getAppsByCategory,
    searchApps
  }
}