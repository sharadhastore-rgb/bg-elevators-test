"use client";
import { useActionState, useRef } from "react";
import { KeyRound, Power } from "lucide-react";
import { resetTeamPassword, toggleTeamMember } from "@/app/admin/actions";
import type { FormState } from "@/lib/validation";
import Feedback from "./Feedback";
import SubmitButton from "./SubmitButton";
export default function TeamActions({
  id,
  name,
  active,
  self,
}: {
  id: string;
  name: string;
  active: boolean;
  self: boolean;
}) {
  const [access, accessAction] = useActionState<FormState, FormData>(
      toggleTeamMember.bind(null, id),
      {},
    ),
    [reset, resetAction] = useActionState<FormState, FormData>(
      resetTeamPassword.bind(null, id),
      {},
    ),
    dialog = useRef<HTMLDialogElement>(null);
  return (
    <div className="team-actions">
      <button
        type="button"
        className="button button-secondary button-small"
        onClick={() => dialog.current?.showModal()}
      >
        <KeyRound size={15} />
        Reset password
      </button>
      {!self && (
        <form action={accessAction}>
          <input type="hidden" name="active" value={String(!active)} />
          <SubmitButton
            className={`button button-small ${active ? "button-danger-outline" : "button-secondary"}`}
          >
            <Power size={15} />
            {active ? "Deactivate" : "Activate"}
          </SubmitButton>
        </form>
      )}
      <Feedback {...access} />
      <dialog
        className="confirm-dialog"
        ref={dialog}
        aria-labelledby={`reset-${id}`}
      >
        <form action={resetAction}>
          <h2 id={`reset-${id}`}>Reset password</h2>
          <p>
            Set a new password for {name}. Existing sessions will be signed out.
          </p>
          <label className="label">
            New password
            <input
              className="field"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={72}
              required
            />
          </label>
          <Feedback {...reset} />
          <div className="dialog-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => dialog.current?.close()}
            >
              Close
            </button>
            <SubmitButton>Reset password</SubmitButton>
          </div>
        </form>
      </dialog>
    </div>
  );
}
