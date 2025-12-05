"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { AdaptiveLink } from './adaptive-link';

interface ClientOnlyLinkProps {
  fallbackHref: string;
  getClientHref: () => string;
  children: React.ReactNode;
  className?: string;
}

export function ClientOnlyLink({ fallbackHref, getClientHref, children, className }: ClientOnlyLinkProps) {
  const [clientHref, setClientHref] = useState(fallbackHref);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setClientHref(getClientHref());
  }, [getClientHref]);

  // Utiliser l'href final pour éviter l'hydratation mismatch
  const href = mounted ? clientHref : fallbackHref;

  return (
    <AdaptiveLink href={href} className={className}>
      {children}
    </AdaptiveLink>
  );
}