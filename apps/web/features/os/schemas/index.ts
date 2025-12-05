import { z } from 'zod'
import { BaseEntitySchema } from '@workspace/foundation'

// Window schemas
export const WindowPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const WindowSizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
})

export const WindowInstanceSchema = z.object({
  id: z.string(),
  appId: z.string(),
  title: z.string(),
  isMaximized: z.boolean(),
  position: WindowPositionSchema,
  size: WindowSizeSchema,
  zIndex: z.number(),
  isResizable: z.boolean(),
})

// App schemas
export const OSAppSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string(),
  component: z.any().optional(), // React component for the app
  defaultSize: WindowSizeSchema,
  minSize: WindowSizeSchema,
  maxSize: WindowSizeSchema.optional(),
  isResizable: z.boolean(),
  allowMultipleInstances: z.boolean(),
  category: z.enum(['tools', 'utilities', 'games', 'system']),
})

// Desktop schemas
export const DesktopIconSchema = z.object({
  id: z.string(),
  appId: z.string(),
  position: WindowPositionSchema,
  label: z.string(),
  icon: z.string(),
})

// Notification schemas
export const NotificationActionSchema = z.object({
  label: z.string(),
  action: z.function(),
  style: z.enum(['primary', 'secondary', 'destructive']).optional(),
})

export const OSNotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']),
  timestamp: z.date(),
  duration: z.number().optional(),
  actions: z.array(NotificationActionSchema).optional(),
})

// OS State schema
export const OSStateSchema = z.object({
  desktop: z.object({
    wallpaper: z.string(),
    icons: z.array(DesktopIconSchema),
    gridSize: z.number(),
    snapToGrid: z.boolean(),
  }),
  windows: z.object({
    instances: z.array(WindowInstanceSchema),
    activeWindowId: z.string().nullable(),
    zIndexCounter: z.number(),
  }),
  apps: z.object({
    installed: z.array(OSAppSchema),
    running: z.array(z.string()),
  }),
  system: z.object({
    notifications: z.array(OSNotificationSchema),
    time: z.date(),
    startMenuOpen: z.boolean(),
    contextMenuOpen: z.boolean(),
    contextMenuPosition: WindowPositionSchema.optional(),
    theme: z.enum(['light', 'dark', 'system']),
    debugMode: z.boolean(),
  }),
})

// Export types
export type WindowPosition = z.infer<typeof WindowPositionSchema>
export type WindowSize = z.infer<typeof WindowSizeSchema>
export type WindowInstance = z.infer<typeof WindowInstanceSchema>
export type OSApp = z.infer<typeof OSAppSchema>
export type DesktopIcon = z.infer<typeof DesktopIconSchema>
export type OSNotification = z.infer<typeof OSNotificationSchema>
export type NotificationAction = z.infer<typeof NotificationActionSchema>
export type OSState = z.infer<typeof OSStateSchema>

// Component prop types
export interface WindowProps {
  window: WindowInstance
  children: React.ReactNode
  onClose: () => void
  onMaximize: () => void
  onMove: (position: WindowPosition) => void
  onResize: (size: WindowSize) => void
  onFocus: () => void
}

export interface DesktopProps {
  icons: DesktopIcon[]
  onIconDoubleClick: (appId: string) => void
  onIconMove: (iconId: string, position: WindowPosition) => void
  onContextMenu: (position: WindowPosition) => void
}

export interface TaskbarProps {
  runningApps: WindowInstance[]
  onAppClick: (windowId: string) => void
  notifications: OSNotification[]
  appOpener: import('../utils/app-opener').AppOpener
}