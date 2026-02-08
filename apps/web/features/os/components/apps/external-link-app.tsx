'use client'

import { useEffect } from 'react'

interface ExternalLinkAppProps {
  title: string
  url: string
}

export function ExternalLinkApp({ title, url }: ExternalLinkAppProps) {
  useEffect(() => {
    // Ouvrir dans une nouvelle page
    window.open(url, '_blank')
  }, [url])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">
          Le wiki s'ouvre dans un nouvel onglet
        </p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Ouvrir le wiki
        </a>
      </div>
    </div>
  )
}