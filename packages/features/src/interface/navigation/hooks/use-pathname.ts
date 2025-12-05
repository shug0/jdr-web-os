"use client";

import { useState, useEffect } from 'react';

export function usePathnameAdaptive(): string {
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    // Try Next.js first
    try {
      const { usePathname } = require('next/navigation');
      setPathname(usePathname());
      return;
    } catch {
      // Fallback to window.location
      if (typeof window !== 'undefined') {
        setPathname(window.location.pathname);
        
        // Listen for navigation changes
        const handleLocationChange = () => {
          setPathname(window.location.pathname);
        };
        
        window.addEventListener('popstate', handleLocationChange);
        return () => {
          window.removeEventListener('popstate', handleLocationChange);
        };
      }
    }
  }, []);

  return pathname;
}