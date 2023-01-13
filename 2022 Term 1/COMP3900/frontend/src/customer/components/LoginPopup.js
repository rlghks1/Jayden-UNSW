import React, { useState } from 'react'
import styled from 'styled-components';
import Button from './Button';

const Background = styled.div`
  width: 100%;
  min-height: 2567px;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0px;
`

const PopupWindow = styled.div`
  top: 20%;  
  bottom: 25%
  width: 400px;
  height: 475px;
  min-width: 400px;
  min-height: 500px;
  background: white;
  position: fixed;
  z-index: 100;
  border-radius: 3px;
`
/* 
  This file shows information about login/register
  An user can register / login / reset password on this page
*/
const LoginPopup = ({ open, onClose, onLogin, onRegister, navigate }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passShown, setPassShown] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    onLogin({email, password}) 
    setEmail("")
    setPassword("")
  }

  const onForgot = (e) => {
    e.preventDefault()
    navigate("/forgotpassword")
    onClose()
  }

  const showPass = () => {
    setPassShown(!passShown)
  }

  if (!open) return null

  return(
    <>
      <Background className="background">
        <PopupWindow classname="popup" open={open}>
          <Button 
            type="exit"
            text="X"
            onClick={onClose}
          />
          <h3>YOUR ACCOUNT FOR EVERYTHING NFT</h3>
          <form className="login-form" onSubmit={onSubmit}>
            <input 
              type="email" 
              placeholder=" Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type={passShown ? "text" : "password"} 
              placeholder=" Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="check">
              <p>Show Password</p>
              <input 
                className="checkbox"
                type="checkbox" 
                onClick={showPass}
              />
            </label>
            <button type="submit">SIGN IN</button>
          </form>
          <div className="bottom-text">
            <p>Not a member?</p>
            <Button 
              type="text"
              text="Join us."
              onClick={onRegister}
            />
          </div>
          <div className="bottom-text">
            <p>Forgot Password?</p>
            <Button 
              type="text"
              text="Click here."
              onClick={onForgot}
            />
          </div>
        </PopupWindow>
      </Background>
    </>
  )
}

export default LoginPopup