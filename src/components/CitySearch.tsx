"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CitySearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/city/${encodeURIComponent(q)}`);
  }

  return (
    <form className="search" onSubmit={onSubmit} role="search">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="مثلاً تهران یا Berlin"
        aria-label="نام شهر"
      />
      <button type="submit">جستجو</button>
    </form>
  );
}
