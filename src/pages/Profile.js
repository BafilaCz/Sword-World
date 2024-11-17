import React, { useState, useEffect } from 'react';
import { projectFirestore, auth } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import useUserDetails from '../context/userDetailsContext'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import defaultPfp from '../img/defaultPfp.png'
import "./Profile.css"

const Profile = () => {
    const user = useUser();  // Get the authenticated user
    const { userDetails, loading } = useUserDetails();

    const handleLogOut = async () => {
        try {
            await auth.signOut();
            window.location = "/login";
        } catch (error) {
            toast.error(error.message, { position: 'bottom-center' });
        }
    };

    if (loading) {
        return <p className='loading'>Loading...</p>;  // Display loading message
    }

    if (!user) {
        return null;  // Don't render anything if user is not logged in
    }

    return (
        <div className='profile'>
            {userDetails ? (
                <div className='profileContent'>   
                    <img 
                        src={userDetails.photo ? `${userDetails.photo}` : defaultPfp} 
                        alt="User profile" referrerPolicy="no-referrer" 
                        className='profileUserPhoto'
                    />  
                    <h3 className='profileUserName'>{`${userDetails.firstName} ${userDetails.lastName}`}</h3>
                    <p className='profileUserEmail'><span className='profileUserInfo'>Email:</span> {userDetails.email}</p>
                    <button onClick={handleLogOut} className='profileLogout'>Odhlásit se</button>


                </div>
            ) : (
                <p className='loading'>User data not available</p>
            )}
        </div>
    );
};

export default Profile;
