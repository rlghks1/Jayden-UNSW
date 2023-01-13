import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Button from './Button'

const NavItem = styled.div`
flex: 1;
display: flex;
justify-content: space-between;
align-items: center;
`
/*
  This page includes all categories on homepage
*/
const Botnav = () => {
  let navigate = useNavigate()
  return (
    <div className={"botnav"}>
      <NavItem>
        <Button 
          type="text" 
          text="Human"
          onClick={() => {navigate("/category/human")}}
          />
      </NavItem>
      <NavItem>
        <Button 
          type="text" 
          text="Animal"
          onClick={() => {navigate("/category/animal")}}
        />
      </NavItem>
      <NavItem>
        <Button 
          type="text" 
          text="Nature"
          onClick={() => {navigate("/category/nature")}}
        />
      </NavItem>
      <NavItem>
        <Button 
          type="text" 
          text="Abstract"
          onClick={() => {navigate("/category/abstract")}}
        />
      </NavItem>
    </div>
  )
}

export default Botnav