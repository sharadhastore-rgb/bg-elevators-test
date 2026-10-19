"use client";

import { useActionState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { deleteConfiguratorRequest } from "@/app/admin/configurator-actions";
import Feedback from "@/components/Feedback";
import SubmitButton from "@/components/SubmitButton";

export default function ConfiguratorRequestDelete({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action] = useActionState(
    deleteConfiguratorRequest.bind(null, id),
    {},
  );

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        <Trash2 size={16} aria-hidden="true" />
        Delete request
      </button>
      <dialog ref={dialog} className="confirm-dialog" aria-labelledby={`delete-configurator-${id}`}>
        <form action={action}>
          <div className="dialog-icon"><Trash2 size={24} /></div>
          <h2 id={`delete-configurator-${id}`}>Delete configuration request?</h2>
          <p><strong>{name}</strong> and all submitted project details will be permanently deleted.</p>
          <Feedback error={state.error} />
          <div className="dialog-actions">
            <button className="button button-secondary" type="button" autoFocus onClick={() => dialog.current?.close()}>Cancel</button>
            <SubmitButton className="button button-danger" pendingText="Deleting…">Delete request</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
