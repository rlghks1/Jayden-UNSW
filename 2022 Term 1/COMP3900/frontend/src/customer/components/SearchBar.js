import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";

/* 
This file gets a search keyword from an user and shows the filtered results 
*/
const SearchBar = () => {
  const [query, setQuery] = useState('')
  let navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault()
      navigate(`/search?${query}`,
      {state : {query: query}}
      )
    setQuery("")
  }


  return (
    <div>
      <form className="search-bar" onSubmit={onSubmit}>
        <input 
          type="text" 
          placeholder=" Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">
          <FaSearch/>
        </button>
      </form>
    </div>
  )
}

export default SearchBar