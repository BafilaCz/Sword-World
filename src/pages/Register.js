import "./Register.css"
import React from 'react'
import { projectFirestore, auth } from "../firebase/config"
import {createUserWithEmailAndPassword} from "firebase/auth"
import { useState } from 'react'
import {doc, setDoc} from "firebase/firestore"
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
      }

    const handleRegister = async (e) => {
        e.preventDefault()
        try{
            
            // registruju usera do database
            await createUserWithEmailAndPassword(auth, email, password)
            const user = auth.currentUser

            // pokud je ristrovany, nastavi jmeno a email do databaze
            if(user){
                await setDoc(doc(projectFirestore, "Users", user.uid), {email: user.email, firstName: firstName, lastName: lastName, photo: "https://firebasestorage.googleapis.com/v0/b/swordworld-10d4f.appspot.com/o/Default_pfp.svg.png?alt=media&token=c370f28b-c686-4670-955a-0f6773d29cc3", cart: [], })
            }
            toast.success("Registrováno úspěšně", {position: 'top-center'})
            window.location = "/"


        }
        catch(error){
            toast.error(error.message, {position: 'bottom-center'})
            

        }
    }
  return (
    <div className="registerContent">

        <form action="submit" onSubmit={handleRegister} className="registerForm">
            <h3 className="registerTitle">Registrace</h3>
            <p className="registerInputTag">Jméno</p>
            <input type="text" placeholder='Jméno' className='inputFirtstName' onInput={(e) => {setFirstName(e.target.value)}} maxLength={20}/>
            <p className="registerInputTag">Příjmení</p>
            <input type="text" placeholder='Příjmení' className='inputLastName' onInput={(e) => {setLastName(e.target.value)}} maxLength={20}/>
            <p className="registerInputTag">Email</p>
            <input type="text" placeholder='email' className='inputEmail' onInput={(e) => {setEmail(e.target.value)}}/>
            <p className="registerInputTag">Heslo</p>
            <input type={showPassword ? "text" : "password" } placeholder='heslo' className='inputPassword' onInput={(e) => {setPassword(e.target.value)}}/>
            <p onClick={togglePasswordVisibility} className='inputPasswordToggle'>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
            </p>
            <br />
            <input type="submit" value="Registrovat se" />
            <p className="registerLoginLink">Již máte účet? <a href="/login">Přihlašte se</a></p>
        </form>



    </div>
  )
}

export default Register