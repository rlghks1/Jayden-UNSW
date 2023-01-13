import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from './Button'
import LoginPopup from './LoginPopup'
import RegoPopup from './RegoPopup'
import SearchBar from './SearchBar'
import { useNavigate } from 'react-router-dom'
import { FaHandHoldingHeart, FaOpencart, FaUserAstronaut } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu"

const Left = styled.div`
flex: 1;
display: flex;
justify-content: flex-start;
align-items: center;
padding-left: 10px;
`

const Centre = styled.div`
flex: 2;
display: flex;
justify-content: center;
align-items: center;
padding-right: 10%;
`
const Right = styled.div`
flex: 1;
display: flex;
justify-content: flex-end;
align-items: center;
padding-right: 10px;
`

/* 
This file shows topnav part including logo, search bar, login/register
*/
const Topnav = ({ toggleTheme, refreshTheme, theme, logIn, logOut }) => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [regoOpen, setRegoOpen] = useState(false)
  const [showIcons, setShowIcons] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [logoURL, setLogoURL] = useState("")

  let navigate = useNavigate()

  // process user/admin login
  useEffect(() => {
    const currUser = localStorage.getItem("currentUser")
    if (!(currUser === null || currUser === "")) {
      setLoginOpen(false)
      setShowIcons(true)
    }
    if (theme === "light") {
      setLogoURL("/dawg-logo1200x430.png")
    } else if (theme === "dark") {
      setLogoURL("/dark-logo1200x430.png")
    } else if (theme === "black") {
      setLogoURL("/black-logo1200x430.png")
    }
  }, [theme])

  const onLogin = async({email, password}) => {
    const response = await fetch("/users/login", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password }),
    })
    response.json().then(data => {
      console.log(data)
      if (data.Reason === "VALID LOGIN") { 
        setLoginOpen(false)
        setShowIcons(true)

        // Check if the "users" localStorage item exists
        if (localStorage.getItem("users") === null) {
          localStorage.setItem("users", "{}")
        }
        const usersFromLocal = JSON.parse(localStorage.getItem("users"))

        // If this user doesn't exist, set up their data in localStorage
        if (!usersFromLocal.hasOwnProperty(data.user_data.document._id)) {
          let modifiedUsers = usersFromLocal
          modifiedUsers[`${data.user_data.document._id}`] = {"cart":[], "favs":[], "theme":""}
          localStorage.setItem("users", JSON.stringify(modifiedUsers))
        }

        // on success, set currUser and currEmail and update theme
        localStorage.setItem("currentUser", data.user_data.document._id)
        localStorage.setItem("currentEmail", data.user_data.document.email)
        refreshTheme()
        logIn()

        // If admin, redirect
        if (data.user_data.document.admin) {
          navigate("/admin")
        }

      } else if (data.Reason === "INVALID LOGIN") {
        console.log("fail")
        alert("Invalid login")
      } else if (data.Reason === "INVALID EMAIL" ) {
        console.log("fail")
        alert("Invalid email")
      }
    })
  }

  // Process user registration
  const onRegister = async({email, password, f_name, l_name}) => {
    const response = await fetch("/users/register", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password, f_name, l_name }),
    })
    response.json().then(data => {
      console.log(data)
      if (data.Reason === "USER SUCCESSFULLY REGISTERED") { 
        console.log("success")
        alert("User successfully registered")
      } else if (data.Reason === "USER REGISTER FAILED") {
        console.log("fail")
        alert("User registration failed")
      } else if (data.Reason === "USER ALREADY EXISTS" ) {
        console.log("fail")
        alert("User already exists")
      }
    })
  }

  // process user logout
  const onLogout = async() => {
    console.log("hello")
    setShowIcons(false)
    setShowDropdown(false)
    localStorage.setItem("currentUser", "")
    localStorage.setItem("currentEmail", "")
    refreshTheme()
    logOut()
    navigate("/")
  }

  return (
    <div className={"topnav"}>
      <Left>
        <div className='logo'>
          <img 
            src={process.env.PUBLIC_URL+logoURL}
            alt="Guilty NFTs" 
            height="85" 
            width="200" 
            onClick={() => {navigate("/homescreen")}}/>
        </div> 
      </Left>
      <Centre>
        <SearchBar/>
      </Centre>
      <Right>
        {!showIcons && 
          <Button 
            type="text"
            text="LOGIN / REGISTER"
            onClick={() => {setLoginOpen(true)}}
          />
        }
        <LoginPopup 
          open={loginOpen} 
          onClose={() => setLoginOpen(false)} 
          onLogin={onLogin}
          onRegister={() => {
            setLoginOpen(false)
            setRegoOpen(true)
          }}
          navigate={navigate}/>
        <RegoPopup 
          open={regoOpen} 
          onClose={() => setRegoOpen(false)} 
          onRegister={onRegister}
          onLogin={() => {
            setRegoOpen(false)
            setLoginOpen(true)
          }}/>
        {showIcons && <div className="user-buttons">
          <Button 
            type="icon" 
            text={<FaOpencart/>} 
            onClick={() => {navigate("/cart")}}
          />
          <Button 
            type="icon" 
            text={<FaHandHoldingHeart/>} 
            onClick={() => {navigate("/favourites")}}
          />
          <Button 
            type= {`icon ${showDropdown ? "dimmed" : ""}`}
            text={<FaUserAstronaut/>} 
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && <DropdownMenu onLogout={onLogout} toggleTheme={toggleTheme}/>}
        </div>}
      </Right>
    </div>
  )
}

export default Topnav
