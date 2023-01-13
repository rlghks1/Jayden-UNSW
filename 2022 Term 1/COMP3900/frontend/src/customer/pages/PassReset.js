import React, {useState} from 'react'

/*
  This file helps a user to reset his password
*/
const PassReset = () => {
  const [new_password, setNewPass] = useState('')
  const [passShown, setPassShown] = useState(false)
  const [reason, setReason] = useState('')
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  const onSubmit = async(e) => {
    e.preventDefault()
    
    await fetch("/users/reset_password", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({token, new_password}),
    })
    .then(response => response.json().then(data => ({
      reason: data.Reason
    }))
    .then(response => {setReason(response.reason)})
    )
    setNewPass("")
  }

  const showPass = () => {
    setPassShown(!passShown)
  }

  return (   
    <form class="change-pass" onSubmit={onSubmit}>
      <div class="center"> 
        <h3>Change Your Password</h3>
      </div>
      {reason && <div class="center"> 
        <h4>{reason}</h4>
      </div>}
      <div class="center"> 
        <input 
          id="field"
          type={passShown ? "text" : "password"} 
          placeholder=" New Password"
          value={new_password}
          onChange={(e) => setNewPass(e.target.value)}
        />
      </div>
      <div class="center"> 
        <input id="check" type="checkbox" onClick={showPass}/> Show Password
      </div>
      <div class="center"> 
        <button type="submit">CONFIRM</button>
      </div>
    </form>
  )
}

export default PassReset