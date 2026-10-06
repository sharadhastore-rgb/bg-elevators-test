import Link from "next/link";
import { FileQuestion } from "lucide-react";
export default function MissingRecord() {
  return (
    <section className="card empty-state">
      <FileQuestion />
      <h1>Record not found</h1>
      <p>
        This record may have been deleted. Its history is still available in
        Activity.
      </p>
      <Link href="/admin" className="button">
        Back to overview
      </Link>
    </section>
  );
}
