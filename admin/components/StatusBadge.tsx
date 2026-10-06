export function statusTone(status: string) {
  return (
    (
      {
        New: "blue",
        Contacted: "blue",
        "In Progress": "amber",
        Converted: "green",
        Closed: "gray",
        Reviewing: "amber",
        Shortlisted: "blue",
        Selected: "green",
        Rejected: "red",
        Active: "green",
        Inactive: "gray",
      } as Record<string, string>
    )[status] || "gray"
  );
}

const toneClasses: Record<string, string> = {
  blue: "bg-[#eaf4fb] text-[#11658f]",
  amber: "bg-[#fff4e4] text-[#94580f]",
  green: "bg-[#eaf7f0] text-[#24734e]",
  gray: "bg-[#edf1f5] text-[#596e7e]",
  red: "bg-[#fdeeee] text-[#ab3535]",
};

export default function StatusBadge({ status }: { status: string }) {
  const tone = statusTone(status);

  return (
    <span
      className={`status-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-[9px] py-[5px] text-[0.8125rem] font-[550] ${toneClasses[tone]}`}
    >
      <i aria-hidden="true" className="size-[5px] rounded-full bg-current" />
      {status}
    </span>
  );
}
