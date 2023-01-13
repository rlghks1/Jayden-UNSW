import React from 'react'
import Button from "../../customer/components/Button"

import { useNavigate } from 'react-router-dom'

/*
  This file shows admin pages including catalogue, sales and analytics
*/
const ControlPage = () => {
  let navigate = useNavigate()

  return (
    <div className="control-page">
      <Button 
        type="control" 
        text="Catalogue" 
        onClick={() => {navigate("/admin/catalogue")}}
      />
      <Button 
        type="control" 
        text="Orders/Sales" 
        onClick={() => {navigate("/admin/sales")}}
      />
      <Button 
        type="control" 
        text="Analytics" 
        onClick={() => {alert("Analytics not implemented")}}
      />
    </div>
  )
}

export default ControlPage