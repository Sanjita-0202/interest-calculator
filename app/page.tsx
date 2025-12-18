"use client";

import { useState } from "react";
import CalculatorCard from "./components/CalculatorCard";
import InputField from "./components/InputField";

export default function Home() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [time, setTime] = useState(0);

  const interest = (principal * rate * time) / 100;
  const totalAmount = principal + interest;
  const saveCalculation = async () => {
  await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      principal,
      rate,
      time,
      interest,
      total: totalAmount,
    }),
  });
};


  return (
    <main className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
      <CalculatorCard>
        <h1 className="mb-6 text-xl font-semibold text-[#111827]">
          Simple Interest Calculator
        </h1>

        <div className="flex flex-col gap-4">
          <InputField
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
          />

          <InputField
            label="Rate of Interest (%)"
            value={rate}
            onChange={setRate}
          />

          <InputField
            label="Time (years)"
            value={time}
            onChange={setTime}
          />
        </div>
        

        {/* Result */}
        <div className="mt-6 rounded-xl bg-[#EFF6FF] p-4">
          <button
  onClick={saveCalculation}
  className="mt-4 h-11 w-full rounded-xl bg-[#2563EB] text-white font-medium hover:bg-[#1D4ED8]"
>
  Save Calculation
</button>

          <p className="text-sm text-[#1E40AF]">Interest Amount</p>
          <p className="text-2xl font-semibold text-[#1D4ED8]">
            ₹ {interest.toFixed(2)}
          </p>

          <p className="mt-2 text-sm text-[#1E40AF]">Total Amount</p>
          <p className="text-lg font-medium text-[#1D4ED8]">
            ₹ {totalAmount.toFixed(2)}
          </p>
        </div>
      </CalculatorCard>
    </main>
  );
}
