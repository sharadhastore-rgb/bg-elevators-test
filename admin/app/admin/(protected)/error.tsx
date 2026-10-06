"use client";
import { CircleAlert } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="card empty-state">
      <CircleAlert />
      <h1>Unable to load this page</h1>
      <p>
        Check the database connection and try again. Your saved records have not
        been removed.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
