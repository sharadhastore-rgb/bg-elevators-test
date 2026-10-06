"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import Feedback from "./Feedback";
import SubmitButton from "./SubmitButton";

export default function LoginForm({ reset }: { reset?: boolean }) {
  const [state, action] = useActionState(loginAction, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="relative w-full max-w-[408px] overflow-hidden rounded-[30px] border border-white bg-[linear-gradient(145deg,rgba(255,255,255,.96),rgba(245,251,254,.82))] p-7 shadow-[0_32px_90px_rgba(1,47,73,.17),0_12px_30px_rgba(8,124,175,.09),inset_0_1px_rgba(255,255,255,1)] ring-1 ring-[#cfe2ec]/70 backdrop-blur-2xl sm:p-9">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#075f89,#52c2f3,#075f89)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-[#6ac8f2]/12 blur-2xl" aria-hidden="true" />
      <header className="relative mb-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-[#c8e2ef] bg-[linear-gradient(145deg,#fafdff,#e8f6fc)] text-[#087caf] shadow-[0_8px_20px_rgba(8,124,175,.12),inset_0_1px_white]"><ShieldCheck size={19} /></span>
          <div>
            <div className="text-[10px] font-semibold tracking-[0.2em] text-[#087caf]">MEMBER SIGN IN</div>
            <div className="mt-1 text-[10px] text-[#78909d]">Protected admin workspace</div>
          </div>
        </div>
        <h1 className="m-0 text-[clamp(1.95rem,2.6vw,2.35rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-[#012034]">Welcome back</h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-[#667e8c]">Enter your details to continue securely.</p>
      </header>
      {reset && <Feedback success="Password reset. Sign in with your new password." />}
      <Feedback {...state} />
      <label className="mb-4 grid gap-2 text-[12px] font-semibold text-[#29485a]">
        Email address
        <span className="relative block">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#7290a1]" size={18} />
          <input className="block min-h-12 w-full rounded-[14px] border border-[#cfdee6] bg-white/80 py-2.5 pr-3 pl-11 text-[14px] text-[#123449] shadow-[inset_0_1px_2px_rgba(1,47,73,.03)] outline-none transition placeholder:text-[#8ba0ad] hover:border-[#b8d0dc] focus:border-[#3396d6] focus:bg-white focus:shadow-[0_0_0_4px_rgba(51,150,214,.1)]" name="email" type="email" placeholder="you@bgelevators.com" autoComplete="username" maxLength={256} required />
        </span>
      </label>
      <label className="mb-6 grid gap-2 text-[12px] font-semibold text-[#29485a]">
        Password
        <span className="relative block">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#7290a1]" size={18} />
          <input className="block min-h-12 w-full rounded-[14px] border border-[#cfdee6] bg-white/80 py-2.5 pr-12 pl-11 text-[14px] text-[#123449] shadow-[inset_0_1px_2px_rgba(1,47,73,.03)] outline-none transition hover:border-[#b8d0dc] focus:border-[#3396d6] focus:bg-white focus:shadow-[0_0_0_4px_rgba(51,150,214,.1)]" name="password" type={show ? "text" : "password"} autoComplete="current-password" maxLength={72} required />
          <button type="button" className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg border-0 bg-transparent text-[#7896a7] transition hover:bg-[#eaf4f9] hover:text-[#087caf]" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={() => setShow(!show)}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      <SubmitButton className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#087caf] bg-[linear-gradient(135deg,#0a91c9,#066b9a)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(0,112,166,.26),inset_0_1px_rgba(255,255,255,.24)] transition hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_15px_34px_rgba(0,112,166,.32)]" pendingText="Signing in…">
        Sign in <LogIn size={17} />
      </SubmitButton>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#dceaf1] bg-white/60 px-3 py-2.5 text-[11px] text-[#698493]"><ShieldCheck size={14} className="text-[#1685b5]" />Encrypted secure access</div>
      <p className="mt-5 border-t border-[#e5edf1] pt-4 text-center text-[11px] leading-[1.55] text-[#78909d]">Need access or a password reset? Contact your administrator.</p>
    </form>
  );
}
