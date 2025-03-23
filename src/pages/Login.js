import "./Login.css"
import React from 'react'
import { auth } from "../firebase/config"
import { signInWithEmailAndPassword} from "firebase/auth"
import { useState, useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import SignInWithGoogle from '../components/SignInWithGoogle'
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {

  

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }


  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      await signInWithEmailAndPassword(auth, email, password)
      window.location = "/profile"
      toast.success("Přihlášeno", {position: 'top-center'})
    }

    catch(error){
      console.log(error.message)
      toast.error(error.message, {position: 'bottom-center'})
      
    }
  }

  useEffect(() => {
    toast.info("přihlašte se", { position: 'bottom-center' });
  },[])


return (
  <div className="loginContent">

      <form action="submit" onSubmit={handleLogin} className="loginForm">
      <h3 className="loginTitle">Přihlásit se</h3>
      <p className="loginInputTag">Email</p>
      <input type="text" placeholder='email' className='inputEmail' id='inputEmailLogin' onInput={(e) => {setEmail(e.target.value)}}/>
      <p className="registerInputTag">Heslo</p>
      <input type={showPassword ? "text" : "password" } placeholder='heslo' className='inputPassword' onInput={(e) => {setPassword(e.target.value)}}/>
      <p onClick={togglePasswordVisibility} className='inputPasswordToggle'>
      {showPassword ? <FaEyeSlash /> : <FaEye />}
      </p>
      <br />
      <input type="submit" value="Přihláseit se" />


      <p className="loginAlts">-- Nebo se přihlašte pomocí --</p>

      <SignInWithGoogle/>


      <p className="loginRegisterLink">Nemáte účet? založte si ho: <a href="/register">Registrovat se</a></p>

      </form>

  </div>
)
}

export default Login