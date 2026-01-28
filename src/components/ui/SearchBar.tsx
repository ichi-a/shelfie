'use client'

import { useState } from "react"



const SearchBar = ({onSearch, isLoading}) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!query.trim() || isLoading) return;
    onSearch(query);
  }
  return (
    <div className="w-full mx-auto text-center mt-5">
      <form onSubmit={handleSubmit}>
        <input type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="本を検索..."
        className="bg-gray-100 m-2 p-1 rounded border-gray-400 border" />
        <button type="submit" className="bg-blue-500 rounded-lg py-1 px-2 hover:bg-blue-600 text-white">検索</button>
      </form>
    </div>
  )
}

export default SearchBar
