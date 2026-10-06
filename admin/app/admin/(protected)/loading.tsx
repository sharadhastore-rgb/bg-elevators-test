export default function Loading() {
  return (
    <div className="loading-state" role="status" aria-label="Loading admin">
      <div className="skeleton skeleton-heading" />
      <div className="metrics-grid">
        {[0, 1, 2, 3].map((x) => (
          <div className="skeleton skeleton-card" key={x} />
        ))}
      </div>
      <div className="skeleton skeleton-table" />
      <span className="sr-only">Loading records…</span>
    </div>
  );
}
