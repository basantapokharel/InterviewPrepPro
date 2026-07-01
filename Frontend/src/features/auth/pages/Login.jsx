import React, { useState } from 'react'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'









const Login = () => {
  const {loading,handleLogin} = useAuth();
  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")


  const handleSubmit = async (event) =>{
    event.preventDefault();
    await handleLogin({email,password})
    navigate('/')
  }


  if(loading) {
    return(
      <main>
        <h1>Loading..........</h1>
      </main>
    )
  }
    
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(event)=>{setEmail(event.target.value)}} value={email} type="email" id='email' name='email' placeholder='Enter Email Address' />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(event)=>{setPassword(event.target.value)}} value={password} type="password" id='password' name='password' placeholder='Enter password' />
          </div>

          <button className='button primary-button'>Login</button>
        </form>
      </div>
    </main>
  )
}

export default Login
