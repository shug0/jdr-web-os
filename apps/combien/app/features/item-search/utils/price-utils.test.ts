import { describe, it, expect } from 'vitest'
import { decomposePrice, formatPrice, getCoinImage, shouldShowDetailedCoins } from './price-utils'

// Helper function to create price from gold/silver/copper for tests
function createPrice(gold: number, silver: number, copper: number): number {
  // Based on the ratio system: 1 = 1 gold, 0.1 = 10 silver, 0.01 = 1 copper
  return gold + (silver / 100) + (copper / 10000);
}

describe('Price Utils', () => {
  describe('decomposePrice', () => {
    it('should handle 1 = 1 gold piece', () => {
      const result = decomposePrice(1)
      expect(result).toEqual({ gold: 1, silver: 0, copper: 0 })
    })

    it('should handle 0.1 = 10 silver pieces', () => {
      const result = decomposePrice(0.1)
      expect(result).toEqual({ gold: 0, silver: 10, copper: 0 })
    })

    it('should handle 0.01 = 1 silver piece', () => {
      const result = decomposePrice(0.01)
      expect(result).toEqual({ gold: 0, silver: 1, copper: 0 })
    })

    it('should handle 1.5 = 1 gold + 50 silver pieces', () => {
      const result = decomposePrice(1.5)
      expect(result).toEqual({ gold: 1, silver: 50, copper: 0 })
    })

    it('should handle 0.25 = 25 silver pieces', () => {
      const result = decomposePrice(0.25)
      expect(result).toEqual({ gold: 0, silver: 25, copper: 0 })
    })

    it('should handle 0.05 = 5 silver pieces', () => {
      const result = decomposePrice(0.05)
      expect(result).toEqual({ gold: 0, silver: 5, copper: 0 })
    })

    it('should handle 1.23 = 1 gold + 23 silver pieces', () => {
      const result = decomposePrice(1.23)
      expect(result).toEqual({ gold: 1, silver: 23, copper: 0 })
    })

    it('should handle 0.001 = 0.1 silver piece (rounded to 0)', () => {
      const result = decomposePrice(0.001)
      expect(result).toEqual({ gold: 0, silver: 0, copper: 0 })
    })

    it('should handle zero price', () => {
      const result = decomposePrice(0)
      expect(result).toEqual({ gold: 0, silver: 0, copper: 0 })
    })

    it('should handle large values', () => {
      const result = decomposePrice(99.99)
      expect(result).toEqual({ gold: 99, silver: 99, copper: 0 })
    })
  })

  describe('formatPrice', () => {
    it('should format 1 gold correctly', () => {
      expect(formatPrice(1)).toBe('1 po')
    })

    it('should format 0.1 (10 silver) correctly', () => {
      expect(formatPrice(0.1)).toBe('10 pa')
    })

    it('should format 0.01 (1 silver) correctly', () => {
      expect(formatPrice(0.01)).toBe('1 pa')
    })

    it('should format 1.5 (1 gold + 50 silver) correctly', () => {
      expect(formatPrice(1.5)).toBe('1 po 50 pa')
    })

    it('should format 0.25 (25 silver) correctly', () => {
      expect(formatPrice(0.25)).toBe('25 pa')
    })

    it('should format zero with showZero=true', () => {
      expect(formatPrice(0, false, true)).toBe('0 pc')
    })

    it('should format zero without showZero', () => {
      expect(formatPrice(0)).toBe('')
    })
  })

  describe('getCoinImage', () => {
    it('should return gold coin image for gold values', () => {
      expect(getCoinImage(createPrice(5, 0, 0))).toBe('/coins/coin_5.png')
      expect(getCoinImage(createPrice(6, 0, 0))).toBe('/coins/coins_5.png')
    })

    it('should return silver coin image for silver values when no gold', () => {
      expect(getCoinImage(createPrice(0, 5, 0))).toBe('/coins/coin_2.png')
      expect(getCoinImage(createPrice(0, 15, 0))).toBe('/coins/coins_2.png')
    })

    it('should return copper coin image for copper values when no gold or silver', () => {
      expect(getCoinImage(createPrice(0, 0, 5))).toBe('/coins/coin_4.png')
      expect(getCoinImage(createPrice(0, 0, 15))).toBe('/coins/coins_4.png')
    })

    it('should return default silver coin for zero values', () => {
      expect(getCoinImage(createPrice(0, 0, 0))).toBe('/coins/coin_2.png')
    })
  })

  describe('shouldShowDetailedCoins', () => {
    it('should return false for single coin type', () => {
      expect(shouldShowDetailedCoins(createPrice(1, 0, 0))).toBe(false)
      expect(shouldShowDetailedCoins(createPrice(0, 1, 0))).toBe(false)
      expect(shouldShowDetailedCoins(createPrice(0, 0, 1))).toBe(false)
    })

    it('should return true for multiple coin types', () => {
      expect(shouldShowDetailedCoins(createPrice(1, 1, 0))).toBe(true)
      expect(shouldShowDetailedCoins(createPrice(1, 0, 1))).toBe(true)
      expect(shouldShowDetailedCoins(createPrice(0, 1, 1))).toBe(true)
      expect(shouldShowDetailedCoins(createPrice(1, 1, 1))).toBe(true)
    })
  })
})