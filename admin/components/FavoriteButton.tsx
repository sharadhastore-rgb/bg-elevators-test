"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { updateFavorite } from "@/app/admin/actions";

export default function FavoriteButton({
  id,
  name,
  favorite,
  editable,
}: {
  id: string;
  name: string;
  favorite: boolean;
  editable: boolean;
}) {
  const [selected, setSelected] = useState(favorite);
  const [pending, startTransition] = useTransition();

  function toggle() {
    if (!editable || pending) return;
    const next = !selected;
    setSelected(next);
    startTransition(async () => {
      const result = await updateFavorite(id, next);
      if (!result.ok) {
        setSelected(!next);
        return;
      }
    });
  }

  return (
    <button
      type="button"
      className={`favorite-button ${selected ? "is-favorite" : ""}`}
      onClick={toggle}
      disabled={!editable || pending}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${name} ${selected ? "from" : "to"} favorites`}
      title={selected ? "Remove from favorites" : "Add to favorites"}
    >
      <Star size={18} />
    </button>
  );
}
