"use client";
import { useActionState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecord } from "@/app/admin/actions";
import type { FormState } from "@/lib/validation";
import Feedback from "./Feedback";
import SubmitButton from "./SubmitButton";
export default function DeleteButton({
  kind,
  id,
  name,
  compact = false,
}: {
  kind: "lead" | "career";
  id: string;
  name: string;
  compact?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [state, action] = useActionState<FormState, FormData>(
      deleteRecord.bind(null, kind, id),
      {},
    );
  return (
    <>
      <button
        className={compact ? "table-delete" : "button button-danger-outline"}
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Delete ${name}`}
        title={compact ? `Delete ${name}` : undefined}
      >
        <Trash2 size={compact ? 15 : 17} />
        {!compact && "Delete"}
      </button>
      <dialog
        ref={dialog}
        className="confirm-dialog"
        aria-labelledby="delete-title"
      >
        <form action={action}>
          <div className="dialog-icon">
            <Trash2 size={24} />
          </div>
          <h2 id="delete-title">
            Delete {kind === "lead" ? "lead" : "application"}?
          </h2>
          <p>
            <strong>{name}</strong> will be permanently deleted
            {kind === "career" ? ", including the uploaded resume" : ""}. The
            activity history will remain.
          </p>
          <Feedback {...state} />
          <div className="dialog-actions">
            <button
              className="button button-secondary"
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
            >
              Cancel
            </button>
            <SubmitButton
              className="button button-danger"
              pendingText="Deleting…"
            >
              Delete record
            </SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
