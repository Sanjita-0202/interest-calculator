"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTransaction() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetch(`/api/transactions?id=${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, []);

  const updateTransaction = async () => {
    await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/transactions");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Transaction</h2>

      <input
        value={form.title || ""}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        value={form.description || ""}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button onClick={updateTransaction}>Save</button>
    </div>
  );
}
