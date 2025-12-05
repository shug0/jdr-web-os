"use client";

import { useState } from "react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { CurrencySection } from "./currency-section";

export function ShowcaseClient() {
	const [activeTab, setActiveTab] = useState("currencies");

	return (
		<div className="container mx-auto p-4 md:p-8">
			<div className="mb-8">
				<h1 className="text-4xl md:text-5xl font-bold mb-2">
					MJ Assistant
				</h1>
				<p className="text-muted-foreground text-lg">
					Interactive showcase for @workspace/static-data package
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
					<TabsTrigger value="currencies">Currencies</TabsTrigger>
					<TabsTrigger value="materials">Materials</TabsTrigger>
					<TabsTrigger value="items">Items</TabsTrigger>
					<TabsTrigger value="reference">Reference</TabsTrigger>
				</TabsList>

				<TabsContent value="currencies">
					<CurrencySection />
				</TabsContent>

				<TabsContent value="materials">
					<Card>
						<CardHeader>
							<CardTitle>Materials Database</CardTitle>
							<CardDescription>
								Physical properties, calculations, and comparisons
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Materials section coming soon...</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="items">
					<Card>
						<CardHeader>
							<CardTitle>Items Helpers</CardTitle>
							<CardDescription>
								Pricing, weight calculations, and availability checks
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Items section coming soon...</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="reference">
					<Card>
						<CardHeader>
							<CardTitle>Reference Data</CardTitle>
							<CardDescription>
								Universes, periods, genres, and other supporting data
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Reference section coming soon...</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
