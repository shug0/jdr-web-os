'use client'

import { useState, useEffect } from 'react'

// Types for Network Information API
interface NavigatorConnection {
  connection?: {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
    downlink?: number
    rtt?: number
    addEventListener?: (event: string, callback: () => void) => void
    removeEventListener?: (event: string, callback: () => void) => void
  }
  mozConnection?: {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
    downlink?: number
    rtt?: number
    addEventListener?: (event: string, callback: () => void) => void
    removeEventListener?: (event: string, callback: () => void) => void
  }
  webkitConnection?: {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
    downlink?: number
    rtt?: number
    addEventListener?: (event: string, callback: () => void) => void
    removeEventListener?: (event: string, callback: () => void) => void
  }
}

interface NetworkInfo {
  online: boolean
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  downlink?: number
  rtt?: number
}

interface SystemInfo {
  network: NetworkInfo
  isSupported: {
    network: boolean
  }
}

export function useSystemInfo(): SystemInfo {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    network: {
      online: true // Start with default online state for hydration
    },
    isSupported: {
      network: false
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check API support
    const networkSupported = 'connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator

    // Network API
    const updateNetworkInfo = () => {
      const navigatorWithConnection = navigator as NavigatorConnection
      const connection = navigatorWithConnection.connection || 
                        navigatorWithConnection.mozConnection || 
                        navigatorWithConnection.webkitConnection

      // Mettre à jour en une seule fois pour éviter les re-renders multiples
      setSystemInfo(prev => ({
        ...prev,
        isSupported: {
          network: networkSupported
        },
        network: {
          online: navigator.onLine,
          effectiveType: connection?.effectiveType,
          downlink: connection?.downlink,
          rtt: connection?.rtt
        }
      }))
    }

    updateNetworkInfo()

    // Listen for network changes
    window.addEventListener('online', updateNetworkInfo)
    window.addEventListener('offline', updateNetworkInfo)

    if (networkSupported) {
      const navigatorWithConnection = navigator as NavigatorConnection
      const connection = navigatorWithConnection.connection || 
                        navigatorWithConnection.mozConnection || 
                        navigatorWithConnection.webkitConnection
      
      if (connection?.addEventListener) {
        connection.addEventListener('change', updateNetworkInfo)
      }
    }

    return () => {
      window.removeEventListener('online', updateNetworkInfo)
      window.removeEventListener('offline', updateNetworkInfo)
      
      if (networkSupported) {
        const navigatorWithConnection = navigator as NavigatorConnection
        const connection = navigatorWithConnection.connection || 
                          navigatorWithConnection.mozConnection || 
                          navigatorWithConnection.webkitConnection
        
        if (connection?.removeEventListener) {
          connection.removeEventListener('change', updateNetworkInfo)
        }
      }
    }
  }, [])

  return systemInfo
}