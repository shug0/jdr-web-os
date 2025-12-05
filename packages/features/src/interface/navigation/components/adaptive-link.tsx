"use client";

import type React from 'react';

interface AdaptiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AdaptiveLink({ href, children, className, onClick }: AdaptiveLinkProps) {
  // Try to use Next.js Link if available
  try {
    if (typeof window !== 'undefined' || typeof global !== 'undefined') {
      const NextLink = require('next/link').default;
      return (
        <NextLink href={href} className={className} onClick={onClick}>
          {children}
        </NextLink>
      );
    }
  } catch {
    // Next.js not available, use regular anchor
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}