import { describe, it, expect } from "vitest";
import { calculateRevenueSplit, formatCurrency, parseToCents } from "@/lib/currency";

describe("Financial Currency & 80/20 Revenue Split Engine", () => {
  it("accurately divides 10,000 cents ($100.00) into 20% platform fee and 80% creator share", () => {
    const split = calculateRevenueSplit(10000, 2000); // 2000 bps = 20%

    expect(split.grossAmountInCents).toBe(10000);
    expect(split.platformFeeInCents).toBe(2000); // $20.00
    expect(split.userShareInCents).toBe(8000); // $80.00
    expect(split.platformFeeInCents + split.userShareInCents).toBe(split.grossAmountInCents);
  });

  it("handles odd cent values deterministically without losing fractions", () => {
    // e.g. $19.99 = 1999 cents
    const split = calculateRevenueSplit(1999, 2000);

    // 20% of 1999 = 399.8 -> Math.floor -> 399 cents
    // user share = 1999 - 399 = 1600 cents ($16.00)
    expect(split.platformFeeInCents).toBe(399);
    expect(split.userShareInCents).toBe(1600);
    expect(split.platformFeeInCents + split.userShareInCents).toBe(1999);
  });

  it("throws an error if gross amount is negative", () => {
    expect(() => calculateRevenueSplit(-500)).toThrow("Financial amounts cannot be negative");
  });

  it("throws an error if gross amount is not an integer", () => {
    expect(() => calculateRevenueSplit(19.99 as any)).toThrow("Gross amount must be an integer");
  });

  it("parses user dollar input strings into integer cents accurately", () => {
    expect(parseToCents("$49.99")).toBe(4999);
    expect(parseToCents("150")).toBe(15000);
    expect(parseToCents("0.50")).toBe(50);
    expect(parseToCents("$1,250.00")).toBe(125000);
  });

  it("formats integer cents into standard USD currency representation", () => {
    expect(formatCurrency(2500)).toBe("$25.00");
    expect(formatCurrency(1999)).toBe("$19.99");
    expect(formatCurrency(15000)).toBe("$150.00");
    expect(formatCurrency(0)).toBe("$0.00");
  });
});
