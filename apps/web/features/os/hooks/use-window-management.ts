'use client'

import { useCallback, useEffect } from 'react'
import { useOSStore } from '../stores/os-store'

export function useWindowManagement() {
  const {
    windows,
    openApp,
    closeWindow,
    focusWindow,
    maximizeWindow
  } = useOSStore()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Tab - Switch between windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        const visibleWindows = windows.instances
        if (visibleWindows.length > 1) {
          const currentIndex = visibleWindows.findIndex(w => w.id === windows.activeWindowId)
          const nextIndex = (currentIndex + 1) % visibleWindows.length
          const nextWindow = visibleWindows[nextIndex]
          if (nextWindow) {
            focusWindow(nextWindow.id)
          }
        }
      }

      // Ctrl + W - Close active window
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault()
        if (windows.activeWindowId) {
          closeWindow(windows.activeWindowId)
        }
      }

      // F11 - Toggle fullscreen of active window
      if (e.key === 'F11') {
        e.preventDefault()
        if (windows.activeWindowId) {
          maximizeWindow(windows.activeWindowId)
        }
      }

    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [windows.activeWindowId, windows.instances, closeWindow, focusWindow, maximizeWindow])

  // Auto-arrange windows
  const arrangeWindows = useCallback((arrangement: 'cascade' | 'tile' | 'horizontal' | 'vertical') => {
    const visibleWindows = windows.instances.filter(w => !w.isMaximized)
    if (visibleWindows.length === 0) return

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight - 48 // Account for taskbar

    switch (arrangement) {
      case 'cascade':
        visibleWindows.forEach((window, index) => {
          const offset = index * 30
          useOSStore.getState().moveWindow(window.id, {
            x: 50 + offset,
            y: 50 + offset
          })
        })
        break

      case 'tile': {
        const cols = Math.ceil(Math.sqrt(visibleWindows.length))
        const rows = Math.ceil(visibleWindows.length / cols)
        const windowWidth = Math.floor(screenWidth / cols)
        const windowHeight = Math.floor(screenHeight / rows)

        visibleWindows.forEach((window, index) => {
          const col = index % cols
          const row = Math.floor(index / cols)
          
          useOSStore.getState().moveWindow(window.id, {
            x: col * windowWidth,
            y: row * windowHeight
          })
          useOSStore.getState().resizeWindow(window.id, {
            width: windowWidth - 10,
            height: windowHeight - 10
          })
        })
        break
      }

      case 'horizontal': {
        const hWindowWidth = Math.floor(screenWidth / visibleWindows.length)
        visibleWindows.forEach((window, index) => {
          useOSStore.getState().moveWindow(window.id, {
            x: index * hWindowWidth,
            y: 50
          })
          useOSStore.getState().resizeWindow(window.id, {
            width: hWindowWidth - 10,
            height: screenHeight - 100
          })
        })
        break
      }

      case 'vertical': {
        const vWindowHeight = Math.floor(screenHeight / visibleWindows.length)
        visibleWindows.forEach((window, index) => {
          useOSStore.getState().moveWindow(window.id, {
            x: 50,
            y: index * vWindowHeight
          })
          useOSStore.getState().resizeWindow(window.id, {
            width: screenWidth - 100,
            height: vWindowHeight - 10
          })
        })
        break
      }
    }
  }, [windows.instances])

  // Window snapping
  const snapWindow = useCallback((windowId: string, position: { x: number; y: number }) => {
    const snapThreshold = 20
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight - 48

    const snappedPosition = { ...position }

    // Snap to edges
    if (position.x < snapThreshold) {
      snappedPosition.x = 0
    } else if (position.x > screenWidth - snapThreshold) {
      snappedPosition.x = screenWidth
    }

    if (position.y < snapThreshold) {
      snappedPosition.y = 0
    } else if (position.y > screenHeight - snapThreshold) {
      snappedPosition.y = screenHeight
    }

    // Snap to center
    const centerX = screenWidth / 2
    const centerY = screenHeight / 2
    if (Math.abs(position.x - centerX) < snapThreshold) {
      snappedPosition.x = centerX
    }
    if (Math.abs(position.y - centerY) < snapThreshold) {
      snappedPosition.y = centerY
    }

    return snappedPosition
  }, [])

  return {
    arrangeWindows,
    snapWindow,
    activeWindow: windows.instances.find(w => w.id === windows.activeWindowId),
    visibleWindows: windows.instances
  }
}