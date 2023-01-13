import React from 'react'
import Button from "./Button"
import { useNavigate } from 'react-router-dom'

/* 
  This file shows dropdown menu when an user click user icon
*/
const DropdownMenu = ({ onLogout, toggleTheme }) => {

  let navigate = useNavigate()

  return (
    <div className="dropdown-menu">
      <Button 
          type="dropdown" 
          text="My Orders" 
          onClick={() => {navigate("/order-history")}}
      />
      <Button 
          type="dropdown" 
          text="My Reservations" 
          onClick={() => 
            {navigate(`/reservation`)}}
      />
      <Button 
          type="dropdown" 
          text="Change Theme" 
          onClick={toggleTheme}
      />
      <Button 
          type="dropdown" 
          text="Logout" 
          onClick={onLogout}
      />
    </div>
  )
}

export default DropdownMenu