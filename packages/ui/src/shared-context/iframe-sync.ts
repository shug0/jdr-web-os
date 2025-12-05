/**
 * IFrame synchronization utilities
 *
 * Uses postMessage API to synchronize shared context between parent windows and iframes
 * Works across different origins (.jdr.local subdomains or .jdr.coffee subdomains)
 */

import type { SharedContext } from './types'

const MESSAGE_TYPE = 'jdr-context-update'

/**
 * Check if an origin is a valid JDR Coffee domain
 */
function isValidJdrOrigin(origin: string): boolean {
  try {
    const url = new URL(origin)
    const hostname = url.hostname

    return (
      hostname.endsWith('.jdr.coffee') ||
      hostname === 'jdr.coffee' ||
      hostname === 'os.jdr.coffee' ||
      hostname.endsWith('.jdr.local') ||
      hostname === 'jdr.local'
    )
  } catch {
    return false
  }
}

/**
 * Notify all iframes on the page of a context update
 * Called by parent window when context changes
 */
export function notifyIframesOfContextChange(context: SharedContext): void {
  if (typeof window === 'undefined') return

  // Find all iframes and send them the updated context
  const iframes = document.querySelectorAll('iframe')

  for (const iframe of iframes) {
    if (!iframe.contentWindow) continue

    try {
      // Get the iframe's origin from its src
      const iframeSrc = iframe.src
      if (!iframeSrc) continue

      const targetOrigin = new URL(iframeSrc).origin

      // Only send to valid JDR domains
      if (isValidJdrOrigin(targetOrigin)) {
        iframe.contentWindow.postMessage(
          {
            type: MESSAGE_TYPE,
            context,
          },
          targetOrigin
        )
      }
    } catch (error) {
      // Silently fail if iframe is not accessible or has security restrictions
      console.debug('Could not send message to iframe:', error)
    }
  }
}

/**
 * Listen for context updates from parent window
 * Called by iframe windows to receive updates from parent
 *
 * @param callback Function to call when context is updated
 * @returns Cleanup function to remove the event listener
 */
export function listenForParentContextUpdates(
  callback: (context: SharedContext) => void
): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleMessage = (event: MessageEvent) => {
    // Security: only accept messages from valid JDR origins
    if (!isValidJdrOrigin(event.origin)) {
      return
    }

    // Check message type and structure
    if (
      event.data &&
      event.data.type === MESSAGE_TYPE &&
      event.data.context
    ) {
      callback(event.data.context)
    }
  }

  window.addEventListener('message', handleMessage)

  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage)
  }
}
