"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
          maxWidth: 1000,
          margin: "0 auto",
          color: "#000",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1>Transactions</h1>

          <Link href="/transactions/create">
            <button style={primaryBtn}>Add Transaction</button>
          </Link>
        </div>

        {/* LOADING */}
        {loading && <p>Loading transactions...</p>}

        {/* EMPTY STATE */}
        {!loading && transactions.length === 0 && (
          <div
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            <h3>No transactions found</h3>
            <p style={{ marginTop: 8 }}>
              Click <b>Add Transaction</b> to create your first transaction.
            </p>
          </div>
        )}

        {/* LIST */}
        {!loading && transactions.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {transactions.map((tx) => (
              <div
                key={tx._id}
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                <h3>{tx.title}</h3>

                {tx.description && (
                  <p style={{ marginTop: 6 }}>{tx.description}</p>
                )}

                <hr style={{ margin: "12px 0" }} />

                <p><b>Amount:</b> ₹{tx.amount}</p>
                <p><b>Interest:</b> {tx.interestRate}%</p>
                <p><b>Type:</b> {tx.type}</p>
                <p><b>Payment:</b> {tx.paymentMode}</p>
                <p>
                  <b>Date:</b>{" "}
                  {new Date(tx.date).toLocaleDateString()}
                </p>

                {tx.contactPhone && <p>📞 {tx.contactPhone}</p>}
                {tx.contactEmail && <p>✉️ {tx.contactEmail}</p>}

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  <Link href={`/transactions/${tx._id}`}>
                    <button style={secondaryBtn}>Edit</button>
                  </Link>

                  <button
                    style={dangerBtn}
                    onClick={async () => {
                      if (!confirm("Delete this transaction?")) return;
                      await fetch(
                        `/api/transactions/${tx._id}`,
                        { method: "DELETE" }
                      );
                      fetchTransactions();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const dangerBtn: React.CSSProperties = {
  padding: "6px 12px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
