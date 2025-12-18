"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-md text-sm font-medium ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white">
      <h1 className="text-lg font-semibold">Interest Manager</h1>

      <div className="flex gap-2">
        <Link href="/" className={linkClass("/")}>Calculator</Link>
        <Link href="/accounts" className={linkClass("/accounts")}>Accounts</Link>
        <Link href="/transactions" className={linkClass("/transactions")}>Transactions</Link>
        <Link href="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
      </div>
    </nav>
  );
}
