"use client";
import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { createTeamMember } from "@/app/admin/actions";
import type { FormState } from "@/lib/validation";
import Feedback from "./Feedback";
import SubmitButton from "./SubmitButton";
export default function TeamForm() {
  const [state, action] = useActionState<FormState, FormData>(
    createTeamMember,
    {},
  );
  return (
    <form
      action={action}
      className="card team-create grid content-start gap-2 p-4"
    >
      <div className="section-title">
        <UserPlus size={20} />
        <h2>Add team member</h2>
      </div>
      <p className="muted text-[0.8125rem] leading-[1.4]">
        Create an account and share the credentials securely.
      </p>
      <Feedback {...state} />
      <label className="label gap-[5px]">
        Full name
        <input
          className="field py-2"
          name="name"
          required
          minLength={2}
          maxLength={256}
          defaultValue={state.values?.name}
        />
      </label>
      <label className="label gap-[5px]">
        Email address
        <input
          className="field py-2"
          name="email"
          type="email"
          required
          maxLength={256}
          defaultValue={state.values?.email}
        />
      </label>
      <label className="label gap-[5px]">
        Temporary password
        <input
          className="field py-2"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={72}
          required
        />
        <small>At least 10 characters. Share it securely.</small>
      </label>
      <label className="label gap-[5px]">
        Access level
        <select
          className="field py-2"
          name="role"
          defaultValue={state.values?.role || "staff"}
        >
          <option value="staff">Staff</option>
          <option value="viewer">Viewer</option>
          <option value="admin">Administrator</option>
        </select>
      </label>
      <SubmitButton pendingText="Creating…">
        <UserPlus size={17} />
        Create account
      </SubmitButton>
    </form>
  );
}
