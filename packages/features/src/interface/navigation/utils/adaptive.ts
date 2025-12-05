import React from 'react';

// Detection utilities
export function isNextEnvironment(): boolean {
  try {
    require('next/link');
    return true;
  } catch {
    return false;
  }
}

export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  
  if (isNextEnvironment()) {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { usePathname } = require('next/navigation');
      return usePathname();
    } catch {
      return window.location.pathname;
    }
  }
  
  return window.location.pathname;
}

// Adaptive Link component
export function createAdaptiveLink() {
  if (isNextEnvironment()) {
    try {
      const NextLink = require('next/link').default;
      return NextLink;
    } catch {
      // Fallback to regular anchor
      return ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode }) => 
        React.createElement('a', { href, ...props }, children);
    }
  }
  
  return ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode }) => 
    React.createElement('a', { href, ...props }, children);
}