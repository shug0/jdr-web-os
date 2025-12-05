"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Database, Plus } from "lucide-react";
import {
  TypographyH3,
  TypographyP,
} from "@workspace/ui/components/custom/typography";

interface EmptyProxyStateProps {
  onCreateNew: () => void;
}

export default function EmptyProxyState({ onCreateNew }: EmptyProxyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <Database className="h-12 w-12 text-gray-400 mb-3" />
        <Plus className="h-4 w-4 mr-2" />
        <TypographyH3 className="mb-1">No proxies created yet</TypographyH3>
        <TypographyP className="text-sm text-gray-500 mb-4">
          Create your first proxy to get started
        </TypographyP>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Proxy
        </Button>
      </CardContent>
    </Card>
  );
}
