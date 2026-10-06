"use client";
import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateNote } from "@/app/admin/actions";
import type { FormState } from "@/lib/validation";
import Feedback from "./Feedback";
import SubmitButton from "./SubmitButton";
export default function NoteForm({
  kind,
  id,
  note,
}: {
  kind: "lead" | "career";
  id: string;
  note: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(
    updateNote.bind(null, kind, id),
    {},
  );
  return (
    <form action={action}>
      <label className="label">
        Internal note
        <textarea
          className="field"
          rows={5}
          name="adminNote"
          maxLength={10000}
          defaultValue={state.values?.adminNote ?? note}
        />
        <small>Visible only to your team.</small>
      </label>
      <Feedback {...state} />
      <SubmitButton className="button mt-4">
        <Save size={16} />
        Save note
      </SubmitButton>
    </form>
  );
}
