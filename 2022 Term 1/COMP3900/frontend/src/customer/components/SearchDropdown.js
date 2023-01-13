import React from 'react'
import Button from "./Button"

/* 
  This file shows dropdown menu when an user clicks sort method button on search page
*/
const SearchDropdown = ({onSbl, onSbn, onSblp, onSbhp}) => {
  return (
    <div className="searchdropdown-menu">
      <Button 
          type="searchdropdown" 
          text="Likes" 
          onClick={onSbl}
      />
      <Button 
          type="searchdropdown" 
          text="Name" 
          onClick={onSbn}
      />
      <Button 
          type="searchdropdown" 
          text="Lowest price" 
          onClick={onSblp}
      />
    </div>
  )
}

export default SearchDropdown