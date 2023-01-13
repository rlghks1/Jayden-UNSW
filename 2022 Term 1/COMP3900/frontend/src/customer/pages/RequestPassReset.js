import React, {useState} from 'react'

/*
  This file shows information when an user wants to reset their account's password
*/
const RequestPassReset = () => {
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)

  const onSubmit = async(e) => {
    e.preventDefault()

    if (email) {
      setIsValid(true)

      await fetch("/users/request_password_reset", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email}),
      })
        
      setEmail("")
      setIsValid(false)
    }
  }

  return (   
    <form className="change-pass" onSubmit={onSubmit}>
      <div className="center"> 
        <h3>Forgot Your Password?</h3>
      </div>
      {!email && <div className="center"> 
        <h4>Please enter an email.</h4>
      </div>}
      {isValid && <div className="center"> 
        <h4>Password reset was sent to the email.</h4>
      </div>}
      <div className="center"> 
        <input 
          id="field"
          type="close" 
          placeholder=" Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="center"> 
        <button type="submit">CONFIRM</button>
      </div>
    </form>
  )
}

export default RequestPassReset