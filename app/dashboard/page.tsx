"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";
import { exportToExcel } from "@/lib/exportExcel";
import { exportToPDF } from "@/lib/exportPdf";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    totalGiven: 0,
    totalTaken: 0,
    outstanding: 0,
    accounts: 0,
  });

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [accountAnalytics, setAccountAnalytics] = useState<any[]>([]);
  const [interestData, setInterestData] = useState<any[]>([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(setStats);

    fetch("/api/analytics/monthly")
      .then(res => res.json())
      .then(setMonthlyData);

    fetch("/api/analytics/accounts")
      .then(res => res.json())
      .then(setAccountAnalytics);

    fetch("/api/analytics/interest")
      .then(res => res.json())
      .then(setInterestData);
  }, []);

  return (
    <div
      id="dashboard-root"
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        padding: 40,
        color: "#000",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* HEADER */}
        <div style={header}>
          <h1>Dashboard</h1>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              style={excelBtn}
              onClick={() => exportToExcel(accountAnalytics, "accounts-report")}
            >
              Export Excel
            </button>

            <button
              style={pdfBtn}
              onClick={() => exportToPDF("dashboard-root")}
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* DATE FILTER */}
        <div style={filterRow}>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>

        {/* STATS */}
        <div style={statsGrid}>
          <StatCard title="Total Given" value={`₹ ${stats.totalGiven}`} />
          <StatCard title="Total Taken" value={`₹ ${stats.totalTaken}`} />
          <StatCard title="Outstanding" value={`₹ ${stats.outstanding}`} />
          <StatCard title="Accounts" value={stats.accounts} />
        </div>

        {/* CHARTS */}
        <div style={chartsGrid}>
          {/* LINE */}
          <div style={chartCard}>
            <h3>Monthly Transactions</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="amount" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PIE */}
          <div style={chartCard}>
            <h3>Given vs Taken</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Given", value: stats.totalGiven },
                    { name: "Taken", value: stats.totalTaken },
                  ]}
                  dataKey="value"
                  outerRadius={90}
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#dc2626" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR */}
        <div style={{ ...chartCard, marginTop: 20 }}>
          <h3>Account-wise Outstanding</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accountAnalytics}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="outstanding" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* INTEREST VS PRINCIPAL */}
        <div style={{ ...chartCard, marginTop: 20 }}>
          <h3>Interest vs Principal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interestData}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="principal" fill="#2563eb" />
              <Bar dataKey="interest" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value }: any) {
  return (
    <div style={statCard}>
      <p style={{ color: "#6b7280", fontSize: 14 }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const filterRow = {
  display: "flex",
  gap: 12,
  marginBottom: 30,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginBottom: 40,
};

const chartsGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 20,
};

const statCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const chartCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const excelBtn = {
  padding: "10px 16px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const pdfBtn = {
  padding: "10px 16px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
