import React, { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom"
import Adminnav from "../components/Adminnav"

/*
  Parent page for all other admin pages 
*/
const Admin = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuthorised = () => {
      let currUser = localStorage.getItem("currentUser")
      if (currUser === "622b0caaaff1dea5b651efd7") {  // Admin id
        setAdminLoggedIn(true)
      }
    }

    checkAuthorised()
  }, [])
  
  return (
    <>
      {adminLoggedIn && <Adminnav/>}
      {adminLoggedIn && <Outlet/>}
      {!adminLoggedIn && <div>You must be an admin to view this page.</div>}
    </>
  )
}

export default Admin