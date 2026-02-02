'use client'

import { useState } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("")

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
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="本を検索..."
            className="w-full bg-white border border-[#1F4D4F]/10 px-4 py-3 rounded-sm
                      text-[#1F4D4F] placeholder-[#1F4D4F]/30 outline-none
                      focus:border-[#C89B3C] transition-all"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-[#C89B3C] border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#1F4D4F] text-white py-3 px-6 text-sm font-bold uppercase tracking-widest
                    hover:bg-[#1F4D4F]/90 transition-all rounded-sm shadow-sm active:scale-96"
        >
          検索
        </button>
      </form>
    </div>
  )
}

export default SearchBar
