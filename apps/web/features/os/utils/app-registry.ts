import type { OSApp } from '../schemas'

class AppRegistry {
  private apps: Map<string, OSApp> = new Map()
  private listeners: Set<() => void> = new Set()

  register(app: OSApp) {
    this.apps.set(app.id, app)
    this.notifyListeners()
  }

  unregister(appId: string) {
    this.apps.delete(appId)
    this.notifyListeners()
  }

  get(appId: string): OSApp | undefined {
    return this.apps.get(appId)
  }

  getAll(): OSApp[] {
    return Array.from(this.apps.values())
  }

  getByCategory(category: OSApp['category']): OSApp[] {
    return this.getAll().filter(app => app.category === category)
  }

  search(query: string): OSApp[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(app => 
      app.name.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery)
    )
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener()
    }
  }
}

export const appRegistry = new AppRegistry()

// Helper function to register an app
export function registerApp(app: OSApp) {
  appRegistry.register(app)
}

// Helper function to create app with defaults
export function createApp(config: Partial<OSApp> & Pick<OSApp, 'id' | 'name' | 'component'>): OSApp {
  return {
    icon: '/icons/default-app.png',
    description: '',
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
    isResizable: true,
    allowMultipleInstances: false,
    category: 'tools',
    ...config
  }
}