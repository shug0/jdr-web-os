/**
 * Inline script to prevent theme flash on page load
 * This script runs BEFORE React hydration to apply the correct theme class
 *
 * Production: Reads from cookie on .jdr.coffee domain
 * Development: Reads from localStorage
 */
export function ThemeScript() {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for theme initialization before React hydration
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  try {
    // Helper to get cookie value
    function getCookie(name) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const parts = cookie.split('=');
        if (parts[0] === name) {
          return decodeURIComponent(parts[1]);
        }
      }
      return null;
    }

    // Check if we're in production or local domain environment
    const hostname = window.location.hostname;
    const isProduction = hostname.endsWith('.jdr.coffee') || hostname === 'jdr.coffee' || hostname.endsWith('.jdr.local') || hostname === 'jdr.local';

    // Get shared context
    let theme = 'system';
    try {
      if (isProduction) {
        // Production: read from cookie
        const contextCookie = getCookie('jdr-context');
        if (contextCookie) {
          const context = JSON.parse(contextCookie);
          theme = context.theme || 'system';
        }
      } else {
        // Development: read from localStorage
        const contextStorage = localStorage.getItem('jdr-context');
        if (contextStorage) {
          const context = JSON.parse(contextStorage);
          theme = context.theme || 'system';
        }
      }
    } catch (e) {
      console.error('Error reading shared context:', e);
    }

    // Resolve theme
    let resolvedTheme = theme;
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply theme class
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Theme initialization error:', e);
  }
})();
        `,
      }}
    />
  );
}
