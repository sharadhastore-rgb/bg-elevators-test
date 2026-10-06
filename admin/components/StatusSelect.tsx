"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { statusTone } from "./StatusBadge";
type Result = { ok: boolean; status?: string; error?: string };
export default function StatusSelect({
  status,
  statuses,
  action,
  label = "Change status",
}: {
  status: string;
  statuses: readonly string[];
  action: (data: FormData) => Promise<Result>;
  label?: string;
}) {
  const router = useRouter(),
    [selected, setSelected] = useState(status),
    [feedback, setFeedback] = useState(""),
    [pending, startTransition] = useTransition();
  useEffect(() => setSelected(status), [status]);
  function change(nextStatus: string) {
    const previous = selected;
    setSelected(nextStatus);
    setFeedback("");
    const data = new FormData();
    data.set("status", nextStatus);
    startTransition(async () => {
      try {
        const result = await action(data);
        if (!result.ok) {
          setSelected(previous);
          setFeedback(result.error || "Unable to save.");
          return;
        }
        setFeedback("Saved");
        router.refresh();
      } catch {
        setSelected(previous);
        setFeedback("Unable to save. Please try again.");
      }
    });
  }
  return (
    <div className="status-control">
      <select
        aria-label={label}
        className={`status-select tone-${statusTone(selected)}`}
        name="status"
        value={selected}
        disabled={pending}
        onChange={(event) => change(event.target.value)}
      >
        {statuses.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <span
        className={`status-feedback ${feedback && feedback !== "Saved" ? "is-error" : ""}`}
        role="status"
      >
        {pending ? "Saving…" : feedback}
      </span>
    </div>
  );
}
