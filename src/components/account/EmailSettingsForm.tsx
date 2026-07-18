"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function EmailSettingsForm({ initialEmail }: { initialEmail: string | null }) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/account/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Button type="submit" size="md" variant="secondary" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Save email"}
      </Button>
      {status === "done" && <p className="text-xs text-success">Saved.</p>}
      {status === "error" && <p className="text-xs text-red-500">Couldn't save that email.</p>}
    </form>
  );
}
