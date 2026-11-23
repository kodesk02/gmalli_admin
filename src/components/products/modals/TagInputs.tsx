"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { FormField, fieldClass } from "@/components/ui/form";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // Enter should add a tag, not submit the form
    addTag();
  };

  return (
    <FormField label="Tags">
      {(id) => (
        <>
          <div className="relative">
            <input
              id={id}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type and press Enter to add..."
              className={`${fieldClass} pr-10`}
            />
            <Tag
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <ul className="flex flex-wrap gap-2 pt-1" aria-label="Selected tags">
            {tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => onChange(tags.filter((t) => t !== tag))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </FormField>
  );
}