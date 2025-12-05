interface WindowConstraints {
  minWidth: number
  minHeight: number
  maxWidth: number
  maxHeight: number
  marginTop: number
  marginSides: number
}

interface WindowDimensions {
  position: { x: number; y: number }
  size: { width: number; height: number }
}

/**
 * Calculate optimal window position and size with smart centering and screen constraints
 */
export function calculateWindowDimensions(
  defaultSize: { width: number; height: number },
  existingWindows: Array<{ position: { x: number; y: number }; size: { width: number; height: number } }>,
  isMaximized = false
): WindowDimensions {
  if (typeof window === 'undefined') {
    // SSR fallback
    return {
      position: { x: 100, y: 100 },
      size: defaultSize
    }
  }

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const isMobile = isMobileScreen()
  
  // Constraints for different screen sizes
  const constraints: WindowConstraints = isMobile ? {
    // Mobile constraints - more aggressive sizing
    minWidth: 280,
    minHeight: 200,
    maxWidth: screenWidth - 20, // Very thin margins on mobile
    maxHeight: screenHeight - 80, // Account for mobile UI elements
    marginTop: 40, // Account for taskbar/top bar
    marginSides: 10 // Smaller margins on mobile
  } : {
    // Desktop constraints
    minWidth: 300,
    minHeight: 200,
    maxWidth: Math.min(screenWidth - 80, 1400), // Max 1400px or screen - 80px margin
    maxHeight: Math.min(screenHeight - 120, 1000), // Max 1000px or screen - 120px margin
    marginTop: 40, // Account for taskbar/top bar
    marginSides: 40 // Generous margins on desktop
  }

  // For maximized windows
  if (isMaximized) {
    return {
      position: { x: 0, y: constraints.marginTop },
      size: { 
        width: screenWidth, 
        height: screenHeight - constraints.marginTop 
      }
    }
  }

  const windowCount = existingWindows.length
  
  // Desktop split-screen layout for large screens
  if (isDesktopScreen() && !isMobile) {
    return calculateSplitScreenPosition(windowCount, constraints, screenWidth, screenHeight)
  }

  // Fallback to original centered positioning for smaller screens
  const constrainedSize = {
    width: Math.max(
      constraints.minWidth, 
      Math.min(defaultSize.width, constraints.maxWidth)
    ),
    height: Math.max(
      constraints.minHeight, 
      Math.min(defaultSize.height, constraints.maxHeight)
    )
  }

  // Calculate centered position
  const centeredX = Math.max(
    constraints.marginSides,
    (screenWidth - constrainedSize.width) / 2
  )
  const centeredY = Math.max(
    constraints.marginTop + 20, // Extra margin from top
    (screenHeight - constrainedSize.height) / 2
  )

  // Apply staggering for multiple windows (less on mobile)
  const staggerOffset = isMobile 
    ? Math.min(windowCount * 15, 60) // Smaller stagger on mobile
    : Math.min(windowCount * 30, 150) // Standard stagger on desktop

  const finalPosition = {
    x: Math.min(
      centeredX + staggerOffset,
      screenWidth - constrainedSize.width - constraints.marginSides
    ),
    y: Math.min(
      centeredY + staggerOffset,
      screenHeight - constrainedSize.height - (isMobile ? 10 : 20)
    )
  }

  return {
    position: finalPosition,
    size: constrainedSize
  }
}

/**
 * Check if screen is considered mobile/small
 */
export function isMobileScreen(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 640 // Same as Tailwind sm: breakpoint
}

/**
 * Check if screen is wide enough for split-screen desktop layout
 */
export function isDesktopScreen(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024 // lg breakpoint and above for split-screen
}

/**
 * Calculate split-screen positioning for desktop windows
 * First window: right side, Second window: left side
 */
function calculateSplitScreenPosition(
  windowCount: number,
  constraints: WindowConstraints,
  screenWidth: number,
  screenHeight: number
): { position: { x: number; y: number }; size: { width: number; height: number } } {
  const splitWidth = Math.floor((screenWidth - constraints.marginSides * 3) / 2) // Divided by 2 with margin between
  const splitHeight = screenHeight - constraints.marginTop - 40 // Full height minus margins
  
  // Constrain size to reasonable limits
  const finalWidth = Math.max(constraints.minWidth, Math.min(splitWidth, constraints.maxWidth))
  const finalHeight = Math.max(constraints.minHeight, Math.min(splitHeight, constraints.maxHeight))
  
  if (windowCount === 0) {
    // First window: right side
    return {
      position: {
        x: screenWidth - finalWidth - constraints.marginSides,
        y: constraints.marginTop + 20
      },
      size: {
        width: finalWidth,
        height: finalHeight
      }
    }
  }
  
  // Second window and beyond: left side
  return {
    position: {
      x: constraints.marginSides,
      y: constraints.marginTop + 20
    },
    size: {
      width: finalWidth,
      height: finalHeight
    }
  }
}

/**
 * Get responsive window size based on screen size
 */
export function getResponsiveSize(
  defaultSize: { width: number; height: number }
): { width: number; height: number } {
  if (typeof window === 'undefined') return defaultSize

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  // Mobile optimization
  if (isMobileScreen()) {
    return {
      width: Math.min(defaultSize.width, screenWidth - 40), // 20px margin each side
      height: Math.min(defaultSize.height, screenHeight - 100) // Account for taskbar + margins
    }
  }

  // Desktop - use default but respect screen constraints
  return {
    width: Math.min(defaultSize.width, screenWidth - 80), // 40px margin each side
    height: Math.min(defaultSize.height, screenHeight - 120) // Account for taskbar + margins
  }
}