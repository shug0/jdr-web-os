"use client"

import { Button } from "@workspace/ui/components/button"
import { RefreshCw } from "lucide-react"
import type { ReactNode } from "react"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

interface SectionHeaderProps {
  title: string
  icon?: ReactNode
  onRegenerate?: () => void
  regenerateTooltip?: string
}

export function SectionHeader({
  title,
  icon,
  onRegenerate,
  regenerateTooltip,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      {onRegenerate && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                className="h-8 px-3"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{regenerateTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}