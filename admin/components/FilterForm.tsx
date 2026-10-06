"use client";

import {
  type FormEvent,
  type PropsWithChildren,
  useEffect,
  useRef,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

export default function FilterForm({
  action,
  className,
  children,
}: PropsWithChildren<{ action: string; className: string }>) {
  const form = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function apply(event: FormEvent<HTMLFormElement>) {
    const field = event.target as HTMLInputElement | HTMLSelectElement;
    if (!field.name || field.type === "submit") return;
    if (timer.current) clearTimeout(timer.current);
    if (field.type === "search") {
      timer.current = setTimeout(() => form.current?.requestSubmit(), 450);
      return;
    }
    form.current?.requestSubmit();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      const text = String(value).trim();
      if (text) params.set(key, text);
    }
    const url = params.size ? `${action}?${params}` : action;
    startTransition(() => router.replace(url, { scroll: false }));
  }

  return (
    <form
      ref={form}
      className={className}
      action={action}
      method="get"
      onChange={apply}
      onSubmit={submit}
      aria-busy={pending}
    >
      {children}
    </form>
  );
}
