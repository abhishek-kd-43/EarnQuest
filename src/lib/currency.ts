/**
 * Deterministic financial calculations using integer minor currency units (cents).
 * Never uses floating-point arithmetic for currency manipulation.
 */

export interface RevenueSplit {
  grossAmountInCents: number;
  platformFeeInCents: number;
  userShareInCents: number;
  feePercentage: number;
}

/**
 * Calculates platform fee (20%) and user share (80%) in integer minor units.
 * Remainder is handled deterministically.
 */
export function calculateRevenueSplit(
  grossAmountInCents: number,
  platformFeeBasisPoints: number = 2000 // 20.00% = 2000 bps
): RevenueSplit {
  if (!Number.isInteger(grossAmountInCents)) {
    throw new Error(`Gross amount must be an integer (received: ${grossAmountInCents})`);
  }
  if (grossAmountInCents < 0) {
    throw new Error("Financial amounts cannot be negative");
  }

  // Integer division: (amount * bps) / 10000
  const platformFeeInCents = Math.floor((grossAmountInCents * platformFeeBasisPoints) / 10000);
  const userShareInCents = grossAmountInCents - platformFeeInCents;

  return {
    grossAmountInCents,
    platformFeeInCents,
    userShareInCents,
    feePercentage: platformFeeBasisPoints / 100,
  };
}

/**
 * Formats minor currency units into human-readable currency strings.
 * e.g., 2500 -> "$25.00", 15000 -> "$150.00"
 */
export function formatCurrency(
  amountInCents: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  const majorUnits = amountInCents / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorUnits);
}

/**
 * Converts a user-entered dollar amount string into integer cents.
 * e.g. "49.99" -> 4999, "150" -> 15000
 */
export function parseToCents(amountStr: string): number {
  const cleaned = amountStr.replace(/[^0-9.]/g, "").trim();
  if (!cleaned) return 0;
  const parts = cleaned.split(".");
  const dollars = parseInt(parts[0] || "0", 10);
  let cents = 0;
  if (parts.length > 1) {
    const centStr = (parts[1] + "00").substring(0, 2);
    cents = parseInt(centStr, 10);
  }
  return dollars * 100 + cents;
}
