"use client";

import { useEffect, useState } from "react";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAccounts = async () => {
    const res = await fetch("/api/accounts");
    const json = await res.json();
    setAccounts(json.data || []);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const submitAccount = async () => {
    if (!name || !contact) return alert("Fill all fields");

    if (editingId) {
      await fetch(`/api/accounts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact }),
      });
    }

    setName("");
    setContact("");
    fetchAccounts();
  };

  const editAccount = (acc: any) => {
    setEditingId(acc._id);
    setName(acc.name);
    setContact(acc.contact);
  };

  const deleteAccount = async (id: string) => {
    if (!confirm("Delete this account?")) return;
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    fetchAccounts();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        padding: "40px",
      }}
    >
      <h1 style={{ color: "#000", marginBottom: 24 }}>Accounts</h1>

      {/* FORM */}
      <div
        style={{
          maxWidth: 400,
          background: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          marginBottom: 40,
        }}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={inputStyle}
        />
        <button style={primaryBtn} onClick={submitAccount}>
          {editingId ? "Update Account" : "Add Account"}
        </button>
      </div>

      {/* ACCOUNTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {accounts.map((acc) => (
          <div
            key={acc._id}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              color: "#000",
            }}
          >
            <h3>{acc.name}</h3>
            <p>{acc.contact}</p>

            <p>Total Given: ₹{acc.totalGiven}</p>
            <p>Total Taken: ₹{acc.totalTaken}</p>
            <p>Outstanding: ₹{acc.totalOutstanding}</p>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                style={secondaryBtn}
                onClick={() => editAccount(acc)}
              >
                Edit
              </button>
              <button
                style={dangerBtn}
                onClick={() => deleteAccount(acc._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
  color: "#000",
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
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
