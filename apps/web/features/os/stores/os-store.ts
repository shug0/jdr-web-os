import { create } from 'zustand'
import { Z_INDEX } from '@workspace/foundation/constants'
import type { OSState, WindowInstance, OSApp, DesktopIcon, OSNotification } from '../schemas'
import { calculateWindowDimensions, getResponsiveSize, isMobileScreen } from '../utils/window-positioning'

interface OSActions {
  // Window Management
  openApp: (appId: string, options?: { maximized?: boolean }) => void
  closeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  moveWindow: (windowId: string, position: { x: number; y: number }) => void
  resizeWindow: (windowId: string, size: { width: number; height: number }) => void
  
  // App Management
  registerApp: (app: OSApp) => void
  unregisterApp: (appId: string) => void
  
  // Desktop Management
  moveIcon: (iconId: string, position: { x: number; y: number }) => void
  addDesktopIcon: (icon: DesktopIcon) => void
  removeDesktopIcon: (iconId: string) => void
  
  // System
  addNotification: (notification: Omit<OSNotification, 'id' | 'timestamp'>) => void
  removeNotification: (notificationId: string) => void
  toggleStartMenu: () => void
  openContextMenu: (position: { x: number; y: number }) => void
  closeContextMenu: () => void
  updateTime: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleDebugMode: () => void
}

type OSStore = OSState & OSActions

const initialState: OSState = {
  desktop: {
    wallpaper: '/wallpapers/default.jpg',
    icons: []
  },
  windows: {
    instances: [],
    activeWindowId: null,
    zIndexCounter: Z_INDEX.WINDOW_BASE
  },
  apps: {
    installed: [],
    running: []
  },
  system: {
    notifications: [],
    time: new Date(),
    startMenuOpen: false,
    contextMenuOpen: false,
    theme: 'system' as 'light' | 'dark' | 'system',
    debugMode: false
  }
}

export const useOSStore = create<OSStore>((set, get) => ({
  ...initialState,
  
  // Window Management
  openApp: (appId: string, options = { maximized: false }) => {
    const state = get()
    const app = state.apps.installed.find(a => a.id === appId)
    
    if (!app) return
    
    // Check if app is already running and doesn't allow multiple instances
    if (!app.allowMultipleInstances && state.apps.running.includes(appId)) {
      const existingWindow = state.windows.instances.find(w => w.appId === appId)
      if (existingWindow) {
        get().focusWindow(existingWindow.id)
        return
      }
    }
    
    const windowId = `${appId}-${Date.now()}`
    
    // Auto-maximize on very small screens (phones)
    const shouldAutoMaximize = options.maximized || (isMobileScreen() && window.innerWidth < 500)
    
    // Calculate optimal window dimensions with smart positioning
    const responsiveDefaultSize = getResponsiveSize(app.defaultSize)
    const windowDimensions = calculateWindowDimensions(
      responsiveDefaultSize,
      state.windows.instances,
      shouldAutoMaximize
    )
    
    const newWindow: WindowInstance = {
      id: windowId,
      appId,
      title: app.name,
      isMaximized: shouldAutoMaximize,
      position: windowDimensions.position,
      size: windowDimensions.size,
      zIndex: state.windows.zIndexCounter + 1,
      isResizable: app.isResizable
    }
    
    set(state => ({
      windows: {
        ...state.windows,
        instances: [...state.windows.instances, newWindow],
        activeWindowId: windowId,
        zIndexCounter: state.windows.zIndexCounter + 1
      },
      apps: {
        ...state.apps,
        running: [...state.apps.running, appId]
      }
    }))
  },
  
  closeWindow: (windowId: string) => {
    set(state => {
      const window = state.windows.instances.find(w => w.id === windowId)
      if (!window) return state
      
      const remainingWindows = state.windows.instances.filter(w => w.id !== windowId)
      const stillRunning = remainingWindows.some(w => w.appId === window.appId)
      
      return {
        windows: {
          ...state.windows,
          instances: remainingWindows,
          activeWindowId: state.windows.activeWindowId === windowId 
            ? (remainingWindows[remainingWindows.length - 1]?.id || null)
            : state.windows.activeWindowId
        },
        apps: {
          ...state.apps,
          running: stillRunning 
            ? state.apps.running 
            : state.apps.running.filter(appId => appId !== window.appId)
        }
      }
    })
  },
  
  maximizeWindow: (windowId: string) => {
    set(state => ({
      windows: {
        ...state.windows,
        instances: state.windows.instances.map(w => 
          w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
        )
      }
    }))
  },
  
  focusWindow: (windowId: string) => {
    set(state => ({
      windows: {
        ...state.windows,
        instances: state.windows.instances.map(w => 
          w.id === windowId ? { ...w, zIndex: state.windows.zIndexCounter + 1 } : w
        ),
        activeWindowId: windowId,
        zIndexCounter: state.windows.zIndexCounter + 1
      }
    }))
  },
  
  moveWindow: (windowId: string, position: { x: number; y: number }) => {
    set(state => ({
      windows: {
        ...state.windows,
        instances: state.windows.instances.map(w => 
          w.id === windowId ? { ...w, position } : w
        )
      }
    }))
  },
  
  resizeWindow: (windowId: string, size: { width: number; height: number }) => {
    set(state => ({
      windows: {
        ...state.windows,
        instances: state.windows.instances.map(w => 
          w.id === windowId ? { ...w, size } : w
        )
      }
    }))
  },
  
  // App Management
  registerApp: (app: OSApp) => {
    set(state => {
      const existingApp = state.apps.installed.find(a => a.id === app.id)
      if (existingApp) return state // Already registered, no update needed
      
      return {
        apps: {
          ...state.apps,
          installed: [...state.apps.installed, app]
        }
      }
    })
  },
  
  unregisterApp: (appId: string) => {
    set(state => ({
      apps: {
        ...state.apps,
        installed: state.apps.installed.filter(a => a.id !== appId)
      }
    }))
  },
  
  // Desktop Management
  moveIcon: (iconId: string, position: { x: number; y: number }) => {
    set(state => ({
      desktop: {
        ...state.desktop,
        icons: state.desktop.icons.map(icon => 
          icon.id === iconId ? { ...icon, position } : icon
        )
      }
    }))
  },
  
  addDesktopIcon: (icon: DesktopIcon) => {
    set(state => ({
      desktop: {
        ...state.desktop,
        icons: [...state.desktop.icons.filter(existing => existing.id !== icon.id), icon]
      }
    }))
  },
  
  removeDesktopIcon: (iconId: string) => {
    set(state => ({
      desktop: {
        ...state.desktop,
        icons: state.desktop.icons.filter(icon => icon.id !== iconId)
      }
    }))
  },
  
  // System
  addNotification: (notification: Omit<OSNotification, 'id' | 'timestamp'>) => {
    const newNotification: OSNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date()
    }
    
    set(state => ({
      system: {
        ...state.system,
        notifications: [...state.system.notifications, newNotification]
      }
    }))
    
    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(newNotification.id)
      }, notification.duration)
    }
  },
  
  removeNotification: (notificationId: string) => {
    set(state => ({
      system: {
        ...state.system,
        notifications: state.system.notifications.filter(n => n.id !== notificationId)
      }
    }))
  },
  
  toggleStartMenu: () => {
    set(state => ({
      system: {
        ...state.system,
        startMenuOpen: !state.system.startMenuOpen
      }
    }))
  },
  
  openContextMenu: (position: { x: number; y: number }) => {
    set(state => ({
      system: {
        ...state.system,
        contextMenuOpen: true,
        contextMenuPosition: position
      }
    }))
  },
  
  closeContextMenu: () => {
    set(state => ({
      system: {
        ...state.system,
        contextMenuOpen: false,
        contextMenuPosition: undefined
      }
    }))
  },
  
  updateTime: () => {
    set(state => ({
      system: {
        ...state.system,
        time: new Date()
      }
    }))
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set(state => ({
      system: {
        ...state.system,
        theme
      }
    }))
    localStorage.setItem('os-theme', theme)
  },

  toggleDebugMode: () => {
    set(state => ({
      system: {
        ...state.system,
        debugMode: !state.system.debugMode
      }
    }))
  }
}))

// Note: Time updates are now handled in individual components to prevent hydration issues