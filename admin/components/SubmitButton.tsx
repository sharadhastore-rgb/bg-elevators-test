"use client";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
export default function SubmitButton({
  children,
  pendingText = "Saving…",
  className = "button",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle size={17} className="spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
