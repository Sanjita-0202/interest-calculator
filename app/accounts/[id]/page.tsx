"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AccountDetailPage() {
  const { id } = useParams();
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/accounts/${id}`)
      .then(res => res.json())
      .then(json => setAccount(json.data));

    fetch(`/api/transactions?accountId=${id}`)
      .then(res => res.json())
      .then(setTransactions);
  }, [id]);

  if (!account) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40, background: "#f4f6fb", minHeight: "100vh" }}>
      <h1>{account.name}</h1>
      <p>{account.contact}</p>

      <p><b>Total Given:</b> ₹{account.totalGiven}</p>
      <p><b>Total Taken:</b> ₹{account.totalTaken}</p>
      <p><b>Outstanding:</b> ₹{account.totalOutstanding}</p>

      <h2 style={{ marginTop: 30 }}>Transactions</h2>

      {transactions.map(tx => (
        <div key={tx._id} style={card}>
          <p><b>{tx.title}</b></p>
          <p>₹{tx.amount} — {tx.type}</p>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 10,
  marginTop: 12,
};
