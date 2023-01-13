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
  This file shows information for user registration
  After user enters all information need, he can join as a member on our website
*/
const RegoPopup = ({ open, onClose, onRegister, onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [f_name, setF_name] = useState('')
  const [l_name, setL_name] = useState('')
  
  const onSubmit = (e) => {
    e.preventDefault()
    onRegister({email, password, f_name, l_name}) 
    setEmail("")
    setPassword("")
    setF_name("")
    setL_name("")
  }

  if (!open) {
    return null
  }

  return(
    <>
      <Background className="background">
        <PopupWindow classname="popup" open={open}>
          <Button 
            type="exit"
            text="X"
            onClick={onClose}
          />
          <h3>BECOME A MEMBER</h3>
          <form className="login-form" onSubmit={onSubmit}>
            <div className="inline-input">
              <input 
                type="text" 
                placeholder=" First name"
                value={f_name}
                onChange={(e) => setF_name(e.target.value)}
              />
              <input 
                type="text" 
                placeholder=" Last name"
                value={l_name}
                onChange={(e) => setL_name(e.target.value)}
              />
            </div>
            <input 
              type="email" 
              placeholder=" Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="text" 
              placeholder=" Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">REGISTER</button>
          </form>
          <div className="bottom-text">
            <p>Already a member?</p>
            <Button 
              type="text"
              text="Sign in."
              onClick={onLogin}
            />
          </div>
        </PopupWindow>
      </Background>
    </>
  )
}

export default RegoPopup