"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkStyle = (path: string): React.CSSProperties => ({
    textDecoration: "none",
    color: pathname === path ? "#2563eb" : "#111827",
    fontWeight: pathname === path ? 600 : 500,
  });

  return (
    <nav
      style={{
        background: "#ffffff",
        padding: "14px 30px",
        display: "flex",
        gap: 24,
        borderBottom: "1px solid #e5e7eb",
        alignItems: "center",
      }}
    >
      <Link href="/" style={linkStyle("/")}>
        Home
      </Link>

      <Link href="/dashboard" style={linkStyle("/dashboard")}>
        Dashboard
      </Link>

      <Link href="/calculations" style={linkStyle("/calculations")}>
        Calculations
      </Link>

      <Link href="/accounts" style={linkStyle("/accounts")}>
        Accounts
      </Link>

      <Link href="/transactions" style={linkStyle("/transactions")}>
        Transactions
      </Link>
    </nav>
  );
}
