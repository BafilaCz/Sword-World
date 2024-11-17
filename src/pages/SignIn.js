import React from 'react'
import {auth, googleAuthProvider} from "../firebase/config"
import { useState, useEffect } from 'react'
import {signInWithPopup} from "firebase/auth"

const SignIn = () => {

const [value, setValue] = useState("")
const googleSignInHandle = () => {
    signInWithPopup(auth, googleAuthProvider).then(data)=>{
        setValue(data.user.email)
    }
}

  return (
    <div>
        
        <button onClick={googleSignInHandle}> Sign in with google</button>

    </div>
  )
}

export default SignIn