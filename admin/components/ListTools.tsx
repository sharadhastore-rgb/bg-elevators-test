import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { href, pageSize, type Query } from "@/lib/queries";
import FilterForm from "@/components/FilterForm";
export function Filters({
  path,
  query,
  statuses,
  sources,
  favorites = false,
}: {
  path: string;
  query: Query;
  statuses: readonly string[];
  sources?: readonly string[];
  favorites?: boolean;
}) {
  return (
    <FilterForm className="list-filters" action={path}>
      <label className="search-field">
        <Search size={18} />
        <input
          aria-label="Search records"
          type="search"
          name="q"
          placeholder="Search name, email or phone…"
          maxLength={120}
          defaultValue={query.q}
        />
      </label>
      <select
        className="field filter-select"
        aria-label="Filter by status"
        name="status"
        defaultValue={query.status || ""}
      >
        <option value="">All statuses</option>
        {statuses.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      {sources && (
        <select
          className="field filter-select"
          aria-label="Filter by source"
          name="source"
          defaultValue={query.source || ""}
        >
          <option value="">All sources</option>
          {sources.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      )}
      {favorites && (
        <select
          className="field filter-select"
          aria-label="Filter favorite leads"
          name="favorite"
          defaultValue={query.favorite || ""}
        >
          <option value="">All leads</option>
          <option value="1">Favorites</option>
        </select>
      )}
      {(query.q || query.status || query.source || query.favorite) && (
        <Link className="text-link" href={path}>
          Clear
        </Link>
      )}
    </FilterForm>
  );
}
export function Pagination({
  path,
  query,
  page,
  total,
}: {
  path: string;
  query: Query;
  page: number;
  total: number;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="pagination">
      <span>
        {total
          ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`
          : "0 records"}
      </span>
      <nav aria-label="Pagination">
        {page > 1 ? (
          <Link
            className="icon-button"
            aria-label="Previous page"
            href={href(path, query, { page: String(page - 1) })}
          >
            <ChevronLeft size={18} />
          </Link>
        ) : (
          <button className="icon-button" disabled aria-label="Previous page">
            <ChevronLeft size={18} />
          </button>
        )}
        <span>
          Page {page} of {pages}
        </span>
        {page < pages ? (
          <Link
            className="icon-button"
            aria-label="Next page"
            href={href(path, query, { page: String(page + 1) })}
          >
            <ChevronRight size={18} />
          </Link>
        ) : (
          <button className="icon-button" disabled aria-label="Next page">
            <ChevronRight size={18} />
          </button>
        )}
      </nav>
    </div>
  );
}
