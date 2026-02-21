"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // キーボードを閉じる（スマホ対策）
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // ★ 過剰なガードを排除し、ロジックで制御
    // 空文字、またはスペースのみの場合は何もしない（早期リターン）
    if (!query.trim() || isLoading) return;

    onSearch(query);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="本を検索..."
            className="w-full rounded-sm border border-[#1F4D4F]/10 bg-white px-4 py-3 text-[#1F4D4F] placeholder-[#1F4D4F]/30 transition-all outline-none focus:border-[#C89B3C]"
          />
          {isLoading && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#C89B3C] border-t-transparent" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="rounded-sm bg-[#1F4D4F] px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-sm transition-all hover:bg-[#1F4D4F]/90 active:scale-96"
        >
          検索
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
