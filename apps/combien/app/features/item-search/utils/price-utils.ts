export function decomposePrice(price: number) {
  // Handle the ratio system: 1 = 1 gold, 0.1 = 10 silver, 0.01 = 1 copper
  // This is a decimal-based system where we directly map decimal places to coin counts
  
  // Gold pieces are the whole number part
  const gold = Math.floor(price);
  
  // Silver pieces: the decimal part * 100 gives us the silver count
  // e.g., 0.25 -> 25 silver, 0.1 -> 10 silver, 0.05 -> 5 silver
  const decimal = price - gold;
  const silver = Math.round(decimal * 100);
  
  // For now, we'll keep copper as 0 since the main ratio is gold-to-silver
  const copper = 0;
  
  return { gold, silver, copper };
}

export function formatPrice(price: number, long = false, showZero = false) {
  const { gold, silver, copper } = decomposePrice(price);
  const parts = [];
  
  if (gold > 0) parts.push(`${gold} po`);
  if (silver > 0) parts.push(`${silver} pa`);
  if (copper > 0) parts.push(`${copper} pc`);
  
  if (parts.length === 0 && showZero) return "0 pc";
  return parts.join(" ");
}

export function getCoinImage(price: number): string {
  const { gold, silver, copper } = decomposePrice(price);
  
  // With the new ratio system, adjust thresholds accordingly
  if (gold > 5) return "/coins/coins_5.png";
  if (gold > 0) return "/coins/coin_5.png";
  if (silver > 10) return "/coins/coins_2.png";
  if (silver > 5) return "/coins/coins_2.png";
  if (silver > 0) return "/coins/coin_2.png";
  if (copper > 10) return "/coins/coins_4.png";
  if (copper > 5) return "/coins/coins_4.png";
  if (copper > 0) return "/coins/coin_4.png";
  return "/coins/coin_2.png";
}

export function shouldShowDetailedCoins(price: number): boolean {
  const { gold, silver, copper } = decomposePrice(price);
  // Show detailed coins only if more than one coin type has a value
  const coinTypesWithValue = [gold > 0, silver > 0, copper > 0].filter(Boolean);
  return coinTypesWithValue.length > 1;
}

// These wrapper functions are not needed - call decomposePrice directly where needed

export function formatPriceForDisplay(price: number): string {
  const { gold, silver, copper } = decomposePrice(price);
  const parts = [];
  
  if (gold > 0) parts.push(`${gold} po`);
  if (silver > 0 && gold > 0) parts.push("+");
  if (silver > 0) parts.push(`${silver} pa`);
  if (copper > 0 && (gold > 0 || silver > 0)) parts.push("+");
  if (copper > 0) parts.push(`${copper} pc`);
  
  return parts.join(" ");
}