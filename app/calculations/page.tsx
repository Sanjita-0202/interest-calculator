"use client";

import { useState } from "react";
import { calculateInterest } from "@/lib/interest";

export default function CalculationsPage() {
  const [accountId, setAccountId] = useState("");
  const [principal, setPrincipal] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [interestType, setInterestType] =
    useState<"simple" | "compound">("simple");

  const [compounding, setCompounding] =
    useState<"monthly" | "quarterly" | "yearly">("monthly");

  const [interest, setInterest] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCalculate = async () => {
    if (!accountId || !principal || !interestRate || !startDate || !endDate) {
      alert("Please fill all fields");
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
          compounding:
            interestType === "compound" ? compounding : undefined,
          startDate,
          endDate,
          interest: interestResult,
          totalAmount: total,
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        padding: "40px",
        color: "#000",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "#fff",
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 20 }}>Interest Calculator</h1>

        <label>Account</label>
        <select
          style={input}
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option value="">Select Account</option>
          <option value="ACCOUNT_ID_1">Account 1</option>
          <option value="ACCOUNT_ID_2">Account 2</option>
        </select>

        <label>Principal Amount</label>
        <input
          type="number"
          style={input}
          value={principal}
          onChange={(e) => setPrincipal(+e.target.value)}
        />

        <label>Interest Rate (%)</label>
        <input
          type="number"
          style={input}
          value={interestRate}
          onChange={(e) => setInterestRate(+e.target.value)}
        />

        <label>Start Date</label>
        <input
          type="date"
          style={input}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End Date</label>
        <input
          type="date"
          style={input}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>Interest Type</label>
        <select
          style={input}
          value={interestType}
          onChange={(e) =>
            setInterestType(e.target.value as "simple" | "compound")
          }
        >
          <option value="simple">Simple</option>
          <option value="compound">Compound</option>
        </select>

        {interestType === "compound" && (
          <>
            <label>Compounding</label>
            <select
              style={input}
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

        <button
          onClick={handleCalculate}
          disabled={saving}
          style={primaryBtn}
        >
          {saving ? "Saving..." : "Calculate"}
        </button>

        {interest !== null && totalAmount !== null && (
          <div
            style={{
              marginTop: 24,
              background: "#eff6ff",
              padding: 16,
              borderRadius: 10,
              color: "#000",
            }}
          >
            <p>
              <strong>Interest:</strong> ₹{interest.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> ₹{totalAmount.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 14,
  borderRadius: 6,
  border: "1px solid #d1d5db",
  color: "#000",
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 500,
};
