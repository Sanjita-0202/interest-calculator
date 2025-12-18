"use client";

import { useEffect, useState } from "react";

export default function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [form, setForm] = useState({
    accountId: "",
    date: "",
    amount: "",
    givenOrTaken: "GIVEN",
    interestRate: "",
    interestType: "SIMPLE",
    interestFrequency: "YEARLY",
    modeOfPayment: "CASH",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data.data || []));
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        interestRate: Number(form.interestRate),
        date: new Date(form.date),
      }),
    });

    setForm({
      accountId: "",
      date: "",
      amount: "",
      givenOrTaken: "GIVEN",
      interestRate: "",
      interestType: "SIMPLE",
      interestFrequency: "YEARLY",
      modeOfPayment: "CASH",
      notes: "",
    });

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-lg border">
      <select
        name="accountId"
        value={form.accountId}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select Account</option>
        {accounts.map((acc) => (
          <option key={acc._id} value={acc._id}>
            {acc.name}
          </option>
        ))}
      </select>

      <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} className="w-full border p-2 rounded" required />

      <select name="givenOrTaken" value={form.givenOrTaken} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="GIVEN">Given</option>
        <option value="TAKEN">Taken</option>
      </select>

      <input type="number" name="interestRate" placeholder="Interest Rate (%)" value={form.interestRate} onChange={handleChange} className="w-full border p-2 rounded" required />

      <select name="interestType" value={form.interestType} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="SIMPLE">Simple</option>
        <option value="COMPOUND">Compound</option>
      </select>

      <select name="interestFrequency" value={form.interestFrequency} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="YEARLY">Yearly</option>
        <option value="MONTHLY">Monthly</option>
      </select>

      <input type="text" name="modeOfPayment" placeholder="Mode of payment" value={form.modeOfPayment} onChange={handleChange} className="w-full border p-2 rounded" />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="w-full border p-2 rounded" />

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Add Transaction
      </button>
    </form>
  );
}
