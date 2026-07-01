import React,{useState} from 'react'
import { useNavigate,Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {

    const navigate = useNavigate();
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const {user,loading,handleRegister} = useAuth();
    console.log("States are:")
    console.log(user,loading);


    const handleSubmit = async (event) =>{
      event.preventDefault();
      console.log("Handle Register is now called")
      await handleRegister({username,email,password});
      console.log("Back from handleRegister")
      navigate("/")
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
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input onChange={(event)=>{setUsername(event.target.value)}} value={username} type="text" id='username' name='username' placeholder='Enter Username' />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input onChange={(event)=>{setEmail(event.target.value)}} value={email} type="email" id='email' name='email' placeholder='Enter Email Address' />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input onChange={(event)=>{setPassword(event.target.value)}} value={password} type="password" id='password' name='password' placeholder='Enter Password' />
            </div>

            <button className='button primary-button'>Register</button>
          </form>

          <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
      </main>
  )
}

export default Register
