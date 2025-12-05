"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import { Button } from "@workspace/ui/components/button";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

interface DebugDisplayProps {
	data: unknown;
	title: string;
	defaultOpen?: boolean;
	className?: string;
}

export function DebugDisplay({
	data,
	title,
	defaultOpen = false,
	className = "",
}: DebugDisplayProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(JSON.stringify(data, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
			<div className="flex items-center justify-between">
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm" className="gap-2">
						{isOpen ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
						<span className="font-code text-sm">{title}</span>
					</Button>
				</CollapsibleTrigger>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleCopy}
					className="gap-2"
				>
					{copied ? (
						<>
							<Check className="h-4 w-4 text-green-600" />
							<span className="text-xs">Copied!</span>
						</>
					) : (
						<>
							<Copy className="h-4 w-4" />
							<span className="text-xs">Copy</span>
						</>
					)}
				</Button>
			</div>
			<CollapsibleContent className="mt-2">
				<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-code">
					{JSON.stringify(data, null, 2)}
				</pre>
			</CollapsibleContent>
		</Collapsible>
	);
}
