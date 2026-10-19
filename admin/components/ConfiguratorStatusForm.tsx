"use client";

import { useActionState } from "react";
import { updateConfiguratorRequest } from "@/app/admin/configurator-actions";
import Feedback from "@/components/Feedback";
import SubmitButton from "@/components/SubmitButton";

export default function ConfiguratorStatusForm({
  id,
  status,
  statuses,
}: {
  id: string;
  status: string;
  statuses: string[];
}) {
  const [state, action] = useActionState(updateConfiguratorRequest, {});

  return (
    <form
      action={action}
      className="flex flex-wrap items-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6"
    >
      <input type="hidden" name="id" value={id} />
      <label className="grid gap-2 text-xs font-semibold text-slate-600">
        Request status
        <select
          name="status"
          defaultValue={status}
          className="min-h-11 min-w-44 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 focus:outline-2 focus:outline-sky-600"
        >
          {statuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <SubmitButton
        pendingText="Updating…"
        className="min-h-11 rounded-lg bg-[#006699] px-5 text-sm font-semibold text-white hover:bg-[#005580] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      >
        Update status
      </SubmitButton>
      <div className="basis-full" aria-live="polite">
        <Feedback error={state.error} success={state.success} />
      </div>
    </form>
  );
}
