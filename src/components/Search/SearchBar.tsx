"use client";

import { useState, useRef } from "react";
import type { HistoryEvent } from "@/types";

interface SearchBarProps {
  events: HistoryEvent[];
  onSelect: (event: HistoryEvent) => void;
}

export function SearchBar({ events, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2
    ? events.filter((e) => e.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  function handleSelect(event: HistoryEvent) {
    onSelect(event);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  }

  return (
    <div style={{ position: "relative" }}>
      <input ref={inputRef} type="text" role="textbox"
        placeholder="🔍 Пушкин, Наполеон, 1812..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#e0e0f0", minWidth: 220, outline: "none",
        }}
      />
      {isOpen && results.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8, overflow: "hidden", zIndex: 100,
        }}>
          {results.map((event) => (
            <div key={event.id} onClick={() => handleSelect(event)}
              style={{ padding: "8px 14px", fontSize: 13, color: "#e0e0f0", cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}>
              {event.title}
              <span style={{ fontSize: 11, color: "#606080", marginLeft: 8 }}>{event.dateStart.slice(0, 4)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
