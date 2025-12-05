"use client";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface AttributeCardProps {
  label: string;
  value: string | null;
  icon?: ReactNode;
  onRegenerate?: () => void;
  regenerateTooltip?: string;
  className?: string;
  valueClassName?: string;
}

export function AttributeCard({
  label,
  value,
  icon,
  onRegenerate,
  regenerateTooltip,
  className,
  valueClassName,
}: AttributeCardProps) {
  return (
    <Card className={cn("relative gap-1", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground font-medium">
            {icon && <span className="mr-1.5">{icon}</span>}
            {label}
          </div>
          {onRegenerate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerate}
                    className="h-6 w-6 hover:bg-accent"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {regenerateTooltip || `Régénérer ${label.toLowerCase()}`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("font-medium", valueClassName)}>
          {value || "Aucun(e)"}
        </div>
      </CardContent>
    </Card>
  );
}
