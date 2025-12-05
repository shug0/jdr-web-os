'use client'

import { useState, useEffect } from 'react'

export function Clock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    // Set initial time
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded border border-border/50 hover:bg-muted/30 transition-colors duration-200">
      {time}
    </div>
  )
}