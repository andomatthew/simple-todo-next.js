import { useState, useEffect } from 'react'
import Login from '../components/Login'
import Register from '../components/Register'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [register, setRegister] = useState(false)

  useEffect(() => {
    if(localStorage.getItem('access_token')) {
      router.back()
    }
  }, [])

  return (
    <>
      <div className="columns">
        <div className="column is-one-third is-flex is-flex-direction-column is-justify-content-center p-6" style={{height: '100vh'}}>
          {
            register ? <Register setRegister={setRegister} /> : <Login setRegister={setRegister} />
          }
        </div>
        <div className="column is-flex is-flex-direction-column is-align-items-center is-justify-content-center p-6 has-background-primary">
          <div className="mb-6">
            <p className="is-align-self-flex-start has-text-centered is-size-1 has-text-link is-family-primary has-text-link">Simple Todo App</p>
          </div>
        </div>
      </div>
    </>
  )
}
