import React, { useState, useEffect } from 'react'
import Topnav from '../components/Topnav';
import Botnav from '../components/Botnav';
import { Outlet } from 'react-router-dom';

/*
  This file shows homescreen
*/
const Customer = () => {
	const [loggedIn, setLoggedIn] = useState(false);   
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [theme, setTheme] = useState(() => {
    // GET THEME FROM LOCALSTORAGE USER OBJECT
    let usersFromLocal = JSON.parse(localStorage.getItem("users"))
    let currUser = localStorage.getItem("currentUser")
    if (currUser === null || currUser === "") {
      document.documentElement.setAttribute("data-theme", "light") //set theme to light
      return "light"
    }
    let themeFromLocal = usersFromLocal[`${currUser}`]["theme"]

    if (themeFromLocal === "dark") {
      document.documentElement.setAttribute("data-theme", "dark") //set theme to dark
      return "dark"
    } else {
      document.documentElement.setAttribute("data-theme", "light") //set theme to light
      return "light"
    }
  })

  useEffect(() => {
    document.title = "Guilty NFTs"

    const checkAuthorised = () => {
      let currUser = localStorage.getItem("currentUser")
      if (currUser === "622b0caaaff1dea5b651efd7") {  // Admin id
        setAdminLoggedIn(true)
      }
    }

    checkAuthorised()
  }, [])

  const toggleTheme = () => {
    // GET THEME FROM LOCALSTORAGE USER OBJECT
    let usersFromLocal = JSON.parse(localStorage.getItem("users"))
    let currUser = localStorage.getItem("currentUser")
    let themeFromLocal = usersFromLocal[`${currUser}`]["theme"]

    if (themeFromLocal === "light" || themeFromLocal === "") {
      document.documentElement.setAttribute("data-theme", "dark") //set theme to dark
      setTheme("dark")
      // SET THEME TO LOCALSTORAGE USER OBJECT
      usersFromLocal[`${currUser}`]["theme"] = "dark"
      localStorage.setItem("users", JSON.stringify(usersFromLocal))
    } else if (themeFromLocal === "dark") {
      document.documentElement.setAttribute("data-theme", "black"); //set theme to black
      setTheme("black")
      // SET THEME TO LOCALSTORAGE USER OBJECT
      usersFromLocal[`${currUser}`]["theme"] = "black"
      localStorage.setItem("users", JSON.stringify(usersFromLocal))
    } else if (themeFromLocal === "black") {
      document.documentElement.setAttribute("data-theme", "light"); //set theme to light
      setTheme("light")
      // SET THEME TO LOCALSTORAGE USER OBJECT
      usersFromLocal[`${currUser}`]["theme"] = "light"
      localStorage.setItem("users", JSON.stringify(usersFromLocal))
    }
  }

  const refreshTheme = () => {
    // GET THEME FROM LOCALSTORAGE USER OBJECT
    let usersFromLocal = JSON.parse(localStorage.getItem("users"))
    let currUser = localStorage.getItem("currentUser")

    // If logged out
    if (currUser === null || currUser === "") {
      document.documentElement.setAttribute("data-theme", "light") 
      setTheme("light")
      return
    }

    let themeFromLocal = usersFromLocal[`${currUser}`]["theme"]
    if (themeFromLocal === "light" || themeFromLocal === "") {
      document.documentElement.setAttribute("data-theme", "light") 
      setTheme("light")
    } else if (themeFromLocal === "dark") {
      document.documentElement.setAttribute("data-theme", "dark"); 
      setTheme("dark")
    } else if (themeFromLocal === "black") {
      document.documentElement.setAttribute("data-theme", "black"); 
      setTheme("black")
    }
  }

  return (
    <div className='App'>
      {!adminLoggedIn && <Topnav 
        toggleTheme={toggleTheme} 
        refreshTheme={refreshTheme} 
        theme={theme} 
        logIn={() => {setLoggedIn(true)}}
        logOut={() => {setLoggedIn(false)}}
      />}
      {!adminLoggedIn && <Botnav/>}
      {!adminLoggedIn && <Outlet context={loggedIn}/>}
      {adminLoggedIn && <div>You cannot view customer site as an admin.</div>}
    </div>
  )
}

export default Customer