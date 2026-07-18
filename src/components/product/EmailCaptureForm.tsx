"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function EmailCaptureForm() {
  const [email, setEmail] = useState("");
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

  if (status === "done") {
    return <p className="text-sm text-ink-soft">We'll send the download link to {email}.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-sm text-ink-soft">Want a backup copy? Get the link by email (optional).</p>
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1"
        />
        <Button type="submit" size="md" variant="secondary" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Send"}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-500">Something went wrong. Try a different email.</p>
      )}
    </form>
  );
}
