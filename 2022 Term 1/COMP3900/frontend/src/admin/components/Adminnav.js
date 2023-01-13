import React from 'react'
import styled from 'styled-components'
import Button from "../../customer/components/Button"
import { useNavigate } from 'react-router-dom'

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
`
const Right = styled.div`
flex: 1;
display: flex;
justify-content: flex-end;
align-items: center;
padding-right: 10px;
`

/*
  This component is the navbar, showing on all admin pages
*/
const Adminnav = () => {

  let navigate = useNavigate()

  const onLogout = () => {
    localStorage.setItem("currentUser", "")
    localStorage.setItem("currentEmail", "")
    navigate("/")
  }
  
  return (
    <div className={"adminnav"}>
      <Left>
        <div className='logo'>
          <img src={process.env.PUBLIC_URL +"/dark-logo1200x430.png"} 
          alt="Guilty NFTs" height="85" 
          width="200"
          onClick={() => {navigate("/admin")}}
          />
        </div> 
      </Left>
      <Centre/>
      <Right>
        <Button 
          type="text"
          text="LOGOUT"
          onClick={onLogout}
        />
      </Right>
    </div>
  )
}

export default Adminnav