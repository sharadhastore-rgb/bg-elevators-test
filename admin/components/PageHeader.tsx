export default function PageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="page-header mb-7 flex items-center justify-between gap-6 max-[1200px]:items-start max-[1000px]:flex-wrap max-[760px]:mb-6 max-[760px]:gap-[18px] max-[430px]:mb-[18px] max-[430px]:gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2.5 text-xs font-[650] tracking-[0.12em] text-admin-brand max-[430px]:mb-1 max-[430px]:text-[0.625rem]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[clamp(1.65rem,2.1vw,2rem)] leading-tight font-[650] tracking-[-0.05em] [overflow-wrap:anywhere] max-[760px]:text-[1.75rem] max-[430px]:text-2xl max-[430px]:tracking-[-0.035em]">
          {title}
        </h1>
        <p className="mt-2 text-[0.9375rem] text-admin-muted max-[760px]:text-sm max-[430px]:mt-[3px] max-[430px]:text-[0.8125rem]">
          {description}
        </p>
      </div>
      {action && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5 max-[760px]:w-full">
          {action}
        </div>
      )}
    </header>
  );
}
