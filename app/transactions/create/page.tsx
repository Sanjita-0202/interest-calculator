"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTransactionPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    accountId: "",
    title: "",
    description: "",
    contactPhone: "",
    contactEmail: "",
    amount: "",
    interestRate: "",
    type: "given",
    paymentMode: "cash",
    date: "",
  });

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((json) => {
        setAccounts(json.data || []);
        setLoading(false);
      });
  }, []);

  const submit = async () => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        interestRate: Number(form.interestRate),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to create transaction");
      return;
    }

    router.push("/transactions");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          color: "#000",
        }}
      >
        <h2 style={{ marginBottom: 24 }}>Create Transaction</h2>

        {/* ACCOUNT */}
        <label>Account</label>
        <select
          style={inputStyle}
          value={form.accountId}
          onChange={(e) =>
            setForm({ ...form, accountId: e.target.value })
          }
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>

        {/* TITLE */}
        <label>Title</label>
        <input
          style={inputStyle}
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          style={{ ...inputStyle, height: 80 }}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* CONTACT */}
        <div style={rowStyle}>
          <div>
            <label>Contact Phone</label>
            <input
              style={inputStyle}
              value={form.contactPhone}
              onChange={(e) =>
                setForm({ ...form, contactPhone: e.target.value })
              }
            />
          </div>

          <div>
            <label>Contact Email</label>
            <input
              style={inputStyle}
              value={form.contactEmail}
              onChange={(e) =>
                setForm({ ...form, contactEmail: e.target.value })
              }
            />
          </div>
        </div>

        {/* AMOUNT + INTEREST */}
        <div style={rowStyle}>
          <div>
            <label>Amount</label>
            <input
              type="number"
              style={inputStyle}
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>

          <div>
            <label>Interest Rate (%)</label>
            <input
              type="number"
              style={inputStyle}
              value={form.interestRate}
              onChange={(e) =>
                setForm({ ...form, interestRate: e.target.value })
              }
            />
          </div>
        </div>

        {/* TYPE + PAYMENT */}
        <div style={rowStyle}>
          <div>
            <label>Type</label>
            <select
              style={inputStyle}
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="given">Given</option>
              <option value="taken">Taken</option>
            </select>
          </div>

          <div>
            <label>Payment Mode</label>
            <select
              style={inputStyle}
              value={form.paymentMode}
              onChange={(e) =>
                setForm({ ...form, paymentMode: e.target.value })
              }
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>

        {/* DATE */}
        <label>Date</label>
        <input
          type="date"
          style={inputStyle}
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <button
          onClick={submit}
          style={{
            marginTop: 24,
            padding: "12px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Create Transaction
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 16,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
  color: "#000",
};

const rowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};
