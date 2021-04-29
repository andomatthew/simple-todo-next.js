import { useState } from 'react'
import axios from 'axios'
import Alert from './alerts/RegisterAlert'


export default function Register({ setRegister }) {
  const [notification, setNotification] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)  
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const registerApi = 'http://localhost:3000/api/users/register' 

  function handleChange(e) {
    const name = e.target.name
    const value = e.target.value

    if(name === 'email') {
      setForm({...form, email: value})
    } else {
      setForm({...form, password: value})
    }
  }

  function afterRegister() {
    setNotification(false)
    setRegister(false)
  }

  function inErrorCondition() {
    setNotification(false)
    setError(false)
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault()
      const response = await axios.post(registerApi, form)
      setMessage(response.data.message)
      setNotification(true)
      setForm({email: '', password: ''})
    } catch(err) {
      setError(true)
      setMessage('Most likely the email already been used by another user')
      setNotification(true)
    }
  }
  
  return(
    <>
      {notification ? <Alert afterRegister={afterRegister} message={message} error={error} inErrorCondition={inErrorCondition} /> : ''}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="field">
          <label className="label has-text-info">Email</label>
          <div className="control">
            <input
              name="email" 
              className="input" 
              type="email" 
              placeholder="Email Here" 
              value={form.email}
              onChange={(e) => handleChange(e)} 
            />
          </div>
        </div>
        <div className="field">
          <label className="label has-text-info">Password</label>
          <div className="control">
            <input
              name="password" 
              className="input" 
              type="password" 
              placeholder="Password Here" 
              value={form.password}
              onChange={(e) => handleChange(e)} 
            />
          </div>
        </div>
        <div className="field">
          <input className="button is-fullwidth has-text-info" type="submit" value="Register" />
        </div>
      </form>
      <p className="has-text-info has-text-centered mt-6">Already have account?</p>
      <button className="button has-text-info mt-3" onClick={() => setRegister(false)}>Login</button>
    </>
  )
}