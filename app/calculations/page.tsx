"use client";

import { useState } from "react";
import { calculateInterest } from "@/lib/interest";

export default function CalculationsPage() {
  // Account
  const [accountId, setAccountId] = useState<string>("");

  // Inputs
  const [principal, setPrincipal] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Interest type controls
  const [interestType, setInterestType] =
    useState<"simple" | "compound">("simple");

  const [compounding, setCompounding] =
    useState<"monthly" | "quarterly" | "yearly">("monthly");

  // Results
  const [interest, setInterest] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const handleCalculate = async () => {
    if (
      !accountId ||
      !principal ||
      !interestRate ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill all fields including account");
      return;
    }

    const interestResult = calculateInterest({
      principal,
      interestRate,
      interestType,
      compounding,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    const total = principal + interestResult;

    setInterest(interestResult);
    setTotalAmount(total);

    try {
      setSaving(true);

      await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          principal,
          interestRate,
          interestType,
          compounding: interestType === "compound" ? compounding : undefined,
          startDate,
          endDate,
          interest: interestResult,
          totalAmount: total,
        }),
      });
    } catch (error) {
      console.error("Failed to save calculation", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Interest Calculator</h2>

      {/* Account */}
      <label>Account</label>
      <select
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      >
        <option value="">Select Account</option>
        {/* TEMP: replace with real accounts later */}
        <option value="ACCOUNT_ID_1">Account 1</option>
        <option value="ACCOUNT_ID_2">Account 2</option>
      </select>

      {/* Principal */}
      <label>Principal</label>
      <input
        type="number"
        value={principal}
        onChange={(e) => setPrincipal(Number(e.target.value))}
      />

      {/* Interest Rate */}
      <label>Annual Interest Rate (%)</label>
      <input
        type="number"
        value={interestRate}
        onChange={(e) => setInterestRate(Number(e.target.value))}
      />

      {/* Dates */}
      <label>Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label>End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      {/* Interest Type */}
      <label>Interest Type</label>
      <select
        value={interestType}
        onChange={(e) =>
          setInterestType(e.target.value as "simple" | "compound")
        }
      >
        <option value="simple">Simple Interest</option>
        <option value="compound">Compound Interest</option>
      </select>

      {/* Compounding */}
      {interestType === "compound" && (
        <>
          <label>Compounding</label>
          <select
            value={compounding}
            onChange={(e) =>
              setCompounding(
                e.target.value as "monthly" | "quarterly" | "yearly"
              )
            }
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </>
      )}

      <button onClick={handleCalculate} disabled={saving}>
        {saving ? "Saving..." : "Calculate"}
      </button>

      {/* Results */}
      {interest !== null && totalAmount !== null && (
        <div style={{ marginTop: 20 }}>
          <p>
            <strong>Interest Amount:</strong> ₹{interest}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹{totalAmount}
          </p>
        </div>
      )}
    </div>
  );
}
