"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { DebugDisplay } from "./debug-display";
import {
	DND_CURRENCIES,
	ARIA_CURRENCIES,
	MEDIEVAL_CURRENCIES,
	ALIEN_CURRENCIES,
	formatCurrency,
	formatCurrencyText,
	formatCurrencySymbols,
	formatCurrencySimple,
	toBaseValue,
	fromBaseValue,
	getCurrencyHierarchy,
	isHierarchical,
	type Currency,
} from "@workspace/static-data";

// Currency systems available
const CURRENCY_SYSTEMS = {
	DND: { name: "D&D 5e", currencies: DND_CURRENCIES },
	ARIA: { name: "Aria", currencies: ARIA_CURRENCIES },
	MEDIEVAL: { name: "Medieval Generic", currencies: MEDIEVAL_CURRENCIES },
	ALIEN: { name: "Alien RPG", currencies: ALIEN_CURRENCIES },
} as const;

type CurrencySystemKey = keyof typeof CURRENCY_SYSTEMS;

export function CurrencySection() {
	const [selectedSystem, setSelectedSystem] = useState<CurrencySystemKey>("DND");
	const [inputValue, setInputValue] = useState("150");
	const [selectedCurrency, setSelectedCurrency] = useState<string>("COPPER");

	const currentSystem = CURRENCY_SYSTEMS[selectedSystem];
	const currentCurrencies = currentSystem.currencies;
	const hierarchy = useMemo(
		() => getCurrencyHierarchy(currentCurrencies),
		[currentCurrencies]
	);

	// Calculate formatted output
	const baseValue = parseInt(inputValue) || 0;
	const formatted = useMemo(() => {
		try {
			if (!isHierarchical(currentCurrencies)) {
				return null;
			}
			return formatCurrency(baseValue, currentCurrencies);
		} catch {
			return null;
		}
	}, [baseValue, currentCurrencies]);

	// Get text representations
	const formattedText = useMemo(() => {
		try {
			return formatCurrencyText(baseValue, currentCurrencies);
		} catch {
			return "N/A";
		}
	}, [baseValue, currentCurrencies]);

	const formattedSymbols = useMemo(() => {
		try {
			return formatCurrencySymbols(baseValue, currentCurrencies);
		} catch {
			return "N/A";
		}
	}, [baseValue, currentCurrencies]);

	const formattedSimple = useMemo(() => {
		try {
			return formatCurrencySimple(baseValue, currentCurrencies);
		} catch {
			return "N/A";
		}
	}, [baseValue, currentCurrencies]);

	// Convert from selected currency to base
	const selectedCurrencyObj = currentCurrencies[selectedCurrency as keyof typeof currentCurrencies] as Currency | undefined;
	const convertedToBase = useMemo(() => {
		try {
			if (!selectedCurrencyObj) return 0;
			return toBaseValue(baseValue, selectedCurrencyObj);
		} catch {
			return 0;
		}
	}, [baseValue, selectedCurrencyObj]);

	const convertedFromBase = useMemo(() => {
		try {
			if (!selectedCurrencyObj) return 0;
			return fromBaseValue(baseValue, selectedCurrencyObj);
		} catch {
			return 0;
		}
	}, [baseValue, selectedCurrencyObj]);

	return (
		<div className="space-y-6">
			{/* Currency Systems Overview */}
			<Card>
				<CardHeader>
					<CardTitle>Currency Systems</CardTitle>
					<CardDescription>
						Available currency systems from different RPG universes
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{Object.entries(CURRENCY_SYSTEMS).map(([key, system]) => {
							const currencies = system.currencies;
							const isHier = isHierarchical(currencies);
							const currencyList = Object.values(currencies) as Currency[];

							return (
								<Card
									key={key}
									className={`cursor-pointer transition-all ${selectedSystem === key ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-muted-foreground"}`}
									onClick={() => setSelectedSystem(key as CurrencySystemKey)}
								>
									<CardHeader className="pb-3">
										<CardTitle className="text-lg">{system.name}</CardTitle>
										<CardDescription className="text-xs">
											{isHier ? "Hierarchical" : "Non-hierarchical"}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-1 text-sm">
											{currencyList.map((c) => (
												<div key={c.id} className="flex justify-between">
													<span className="text-muted-foreground">{c.name}</span>
													{c.baseValue && (
														<span className="font-mono text-xs">
															×{c.baseValue}
														</span>
													)}
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Interactive Calculator */}
			<Card>
				<CardHeader>
					<CardTitle>Currency Formatter</CardTitle>
					<CardDescription>
						Convert base values to multiple denominations
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="base-value">Base Value</Label>
							<Input
								id="base-value"
								type="number"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Enter base value..."
							/>
							<p className="text-xs text-muted-foreground">
								{hierarchy[hierarchy.length - 1]?.name || "base units"}
							</p>
						</div>

						<div className="space-y-2">
							<Label>Selected System</Label>
							<Select
								value={selectedSystem}
								onValueChange={(value) =>
									setSelectedSystem(value as CurrencySystemKey)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(CURRENCY_SYSTEMS).map(([key, system]) => (
										<SelectItem key={key} value={key}>
											{system.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Results */}
					<div className="space-y-3 pt-4 border-t">
						<div>
							<Label className="text-sm font-semibold">Formatted Output</Label>
							<div className="mt-2 space-y-2">
								{formatted && formatted.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{formatted.map((f, i) => (
											<div
												key={i}
												className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium"
											>
												{f.amount} {f.currency.symbol || f.currency.name}
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">
										{isHierarchical(currentCurrencies)
											? "Enter a value to see formatted output"
											: "Non-hierarchical currencies cannot be formatted"}
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
							<div>
								<Label className="text-xs text-muted-foreground">
									formatCurrencyText()
								</Label>
								<p className="text-sm font-medium mt-1">{formattedText}</p>
							</div>
							<div>
								<Label className="text-xs text-muted-foreground">
									formatCurrencySymbols()
								</Label>
								<p className="text-sm font-medium mt-1">{formattedSymbols}</p>
							</div>
							<div>
								<Label className="text-xs text-muted-foreground">
									formatCurrencySimple()
								</Label>
								<p className="text-sm font-medium mt-1">{formattedSimple}</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Conversion Calculator */}
			<Card>
				<CardHeader>
					<CardTitle>Currency Converter</CardTitle>
					<CardDescription>
						Convert between different denominations
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="currency-select">Currency</Label>
							<Select
								value={selectedCurrency}
								onValueChange={setSelectedCurrency}
							>
								<SelectTrigger id="currency-select">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(currentCurrencies).map(([key, currency]) => {
										const curr = currency as Currency;
										return (
											<SelectItem key={key} value={key}>
												{curr.name}
												{curr.symbol && ` (${curr.symbol})`}
												{curr.baseValue && ` - ×${curr.baseValue}`}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amount">Amount</Label>
							<Input
								id="amount"
								type="number"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Enter amount..."
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
						<div className="space-y-2">
							<Label className="text-sm font-semibold">To Base Value</Label>
							<p className="text-2xl font-bold font-code">
								{convertedToBase}
							</p>
							<p className="text-xs text-muted-foreground">
								{baseValue} {selectedCurrencyObj?.name} = {convertedToBase} base units
							</p>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-semibold">From Base Value</Label>
							<p className="text-2xl font-bold font-code">
								{convertedFromBase.toFixed(2)}
							</p>
							<p className="text-xs text-muted-foreground">
								{baseValue} base units = {convertedFromBase.toFixed(2)}{" "}
								{selectedCurrencyObj?.name}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Debug Display */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Debug Data</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<DebugDisplay
						data={currentCurrencies}
						title="Current Currency System"
					/>
					<DebugDisplay data={hierarchy} title="Currency Hierarchy" />
					{formatted && <DebugDisplay data={formatted} title="Formatted Result" />}
				</CardContent>
			</Card>
		</div>
	);
}
