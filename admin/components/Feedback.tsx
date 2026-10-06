import { CircleCheck, CircleAlert } from "lucide-react";
export default function Feedback({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;
  return (
    <p
      className={`feedback ${error ? "error" : "success"}`}
      role={error ? "alert" : "status"}
    >
      {error ? <CircleAlert size={18} /> : <CircleCheck size={18} />}
      <span>{error || success}</span>
    </p>
  );
}
