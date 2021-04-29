import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import LoginAlert from './alerts/LoginAlert'

export default function Login({ setRegister }) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [currentUser, setCurrentUser] = useState({
    id: 0,
    email: ''
  })
  const [notification, setNotification] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  
  const router = useRouter()

  const loginApi = 'http://localhost:3000/api/users/login'
  const todoApi = 'http://localhost:3000/todo/'


  function handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    if(name === 'email') {
      setForm({...form, email: value})
    } else {
      setForm({...form, password: value})
    }
  }
  
  async function handleSubmit(e) {
    try {
      e.preventDefault()
      const { data } = await axios.post(loginApi, form)
      localStorage.setItem('access_token', data.access_token)
      setCurrentUser({...currentUser, id: data.id, email: data.email})
      setMessage('Login Success')
      setNotification(true)
      setForm({ email: '', password: '' })
    } catch(err) {
      setNotification(true)
      setMessage('Invalid Email or Password')
      setError(true)
    }
  }

  function successLogin({ email, id }) {
    router.push(todoApi + id)
  }

  function inErrorCondition() {
    setNotification(false)
    setError(false)
  }

  return(
    <>
    {notification ? <LoginAlert message={message} successLogin={() => successLogin(currentUser)} error={error} inErrorCondition={inErrorCondition} /> : ''}
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
        <div className="control has-text-info">
          <input 
            name="password"
            className="input has-text-info" 
            type="password" 
            placeholder="Password Here"
            value={form.password}
            onChange={(e) => handleChange(e)} 
          />
        </div>
      </div>
      <div className="field">
        <input className="button is-fullwidth has-text-info" type="submit" value="Login" />
      </div>
    </form>
    <p className="has-text-info has-text-centered mt-6">Dont have account ? </p>
    <button className="button has-text-info mt-3" value="Register" onClick={() => setRegister(true)}>Register</button>
    </>
  )
}

