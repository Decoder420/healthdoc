/** Envelope money (§4.1): { amount: string, currency } — amounts as decimal strings. */

export type Money = {
  amount: string;
  currency: string;
};

export const DEFAULT_CURRENCY = "INR";

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function toMoney(n: number, currency: string = DEFAULT_CURRENCY): Money {
  return { amount: round2(n).toFixed(2), currency };
}

export function fromMoney(m: Money | number | string): number {
  if (typeof m === "number") return m;
  if (typeof m === "string") return Number(m) || 0;
  return Number(m.amount) || 0;
}

export function moneyZero(currency: string = DEFAULT_CURRENCY): Money {
  return toMoney(0, currency);
}
