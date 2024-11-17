import React from 'react';
import "./SignInWithGoogle.css";
import { googleAuthProvider, auth, projectFirestore } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Cart from '../pages/Cart';

const SignInWithGoogle = () => {



    const googleLogin = () => {
        signInWithPopup(auth, googleAuthProvider).then(async (result) => {
            console.log(result)
            if(result.user){
                const user = result.user
                await setDoc(doc(projectFirestore, "Users", user.uid), {
                    email: user.email, 
                    firstName: user.displayName, 
                    lastName: "", 
                    photo: user.photoURL,
                    cart: []
                })
                window.location = "/"
            }
        }).catch((error) => {
            console.error("Error during Google sign-in:", error);
        });
    }

    return (
        <div className='signInWithGoogleContent'>
            <div className='signInWithGoogle' onClick={googleLogin}>
                <img src={require("../img/googleLogo.png")} className="googleLogo" alt="SignInWithGoogle" />
                <p>Google</p>
            </div>

        </div>
    );
}

export default SignInWithGoogle;
