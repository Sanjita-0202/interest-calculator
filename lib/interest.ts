// lib/interest.ts

/**
 * SIMPLE INTEREST
 */
export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  from: Date,
  to: Date
) {
  const timeInYears =
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 365);

  const interest = (principal * annualRate * timeInYears) / 100;
  return Number(interest.toFixed(2));
}

/**
 * COMPOUND INTEREST
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  from: Date,
  to: Date,
  compounding: "monthly" | "quarterly" | "yearly"
) {
  const timeInYears =
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 365);

  const n =
    compounding === "monthly" ? 12 :
    compounding === "quarterly" ? 4 :
    1;

  const amount =
    principal * Math.pow(1 + annualRate / (100 * n), n * timeInYears);

  const interest = amount - principal;
  return Number(interest.toFixed(2));
}

/**
 * UNIFIED CALCULATOR
 * (Use this everywhere in the app)
 */
export function calculateInterest(params: {
  principal: number;
  interestRate: number;
  interestType: "simple" | "compound";
  compounding?: "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate: Date;
}) {
  const {
    principal,
    interestRate,
    interestType,
    compounding,
    startDate,
    endDate,
  } = params;

  if (interestType === "simple") {
    return calculateSimpleInterest(
      principal,
      interestRate,
      startDate,
      endDate
    );
  }

  return calculateCompoundInterest(
    principal,
    interestRate,
    startDate,
    endDate,
    compounding || "monthly"
  );
}
