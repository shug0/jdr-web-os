'use client'

import { AnimatePresence } from 'framer-motion'
import { 
  DndContext, 
  type DragEndEvent,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
  PointerSensor
} from '@dnd-kit/core'
import { useOSStore } from '../stores/os-store'
import { Window } from './window'

export function WindowManager() {
  const { windows, apps, moveWindow } = useOSStore()
  
  // Sensors configuration optimized for mobile/desktop
  const sensors = useSensors(
    // PointerSensor for unified events (recommended)
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    // TouchSensor for specific touch support
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,     // Delay to prevent conflicts with scroll
        tolerance: 8,   // Movement tolerance during delay
      },
    }),
    // MouseSensor for desktop
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3, // More sensitive on desktop
      },
    })
  )
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    
    if (!active || !delta) return

    // The active ID contains the window ID
    const windowId = active.id as string
    
    // Calculate new position based on delta
    const currentWindow = windows.instances.find(w => w.id === windowId)
    if (!currentWindow) return

    const newPosition = {
      x: Math.max(0, currentWindow.position.x + delta.x),
      y: Math.max(40, currentWindow.position.y + delta.y) // Account for top bar
    }

    // Screen constraints
    const constrainedPosition = {
      x: Math.min(newPosition.x, window.innerWidth - 200),
      y: Math.min(newPosition.y, window.innerHeight - 100)
    }

    moveWindow(windowId, constrainedPosition)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <AnimatePresence mode="sync">
        {windows.instances.map((window) => {
          const app = apps.installed.find(app => app.id === window.appId)
          
          if (!app) return null

          const AppComponent = app.component

          return (
            <Window
              key={window.id}
              window={window}
            >
              <AppComponent windowId={window.id} />
            </Window>
          )
        })}
      </AnimatePresence>
    </DndContext>
  )
}