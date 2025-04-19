import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, updateDoc, doc, getDoc, increment } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';
import useUserDetails from '../context/userDetailsContext';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa";
import "./ReviewsForm.css"
import { MdModeEdit } from "react-icons/md";
import defaultPfp from '../img/defaultPfp.png'



const ReviewsForm = ({ productId }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const { userDetails, loading } = useUserDetails();
    const user = useUser();
    const [showReview, setShowReview] = useState(false)


    const toggleShowReview = () => {
        if(!user){
            window.location = "/login"
        }
        else{
            setShowReview(!showReview)
        }
    }

    const updateProductReview = async (productId, newRating) => {
        const productRef = doc(projectFirestore, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const productData = productSnap.data();
            const currentAverage = productData.averageReview || 0; // Default 0
            const currentCount = productData.reviewCount || 0; // Default 0

            // pocitani prumeru
            const newAverage = ((currentAverage * currentCount) + newRating) / (currentCount + 1);
            const roundedAverage = Math.round(newAverage * 10) / 10; // zaokrouhledo na 1 desetinne

            // update v db
            await updateDoc(productRef, {
                reviewCount: increment(1), // zvysit o 1
                averageReview: roundedAverage, // update na novy prumer
            });

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            toast.warning('Please wait, loading user data...');
            return;
        }

        if (!comment.trim()) {
            toast.error('Comment cannot be empty!');
            return;
        }

        try {
            await addDoc(collection(projectFirestore, 'reviews'), {
                productId,
                userName: `${userDetails.firstName} ${userDetails.lastName}`,
                rating,
                comment,
                timestamp: serverTimestamp(),
                photo: ` ${userDetails.photo || defaultPfp}`
            });

            setComment('');
            setRating(5);

            await updateProductReview(productId, rating);
            window.location.reload()
            // refreshne stránku aby se zobrazila přidaná recenze
            // toast.success('Recenze byla úspěšně přidána!');
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Nastala chyba :(');
        }
    };

    return (
        <div className='reviewsForm'>
        <button className='oneProductReviewButton' onClick={toggleShowReview}> Napsat recenzi {<MdModeEdit />}</button>
        {showReview && (
        
        <div className='reviewsFormOverlay'>
        <form onSubmit={handleSubmit} className='reviewsFormForm'>

        <button className="closeReviewsButton" onClick={toggleShowReview}>
            X
        </button>
            <div className='reviewsFormAreaAndImg'>
            <img src={userDetails.photo} alt="userProfilePic" referrerPolicy="no-referrer"/>
            <textarea className='reviewsFormTextarea' maxLength="10000"
            
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Napište recenzi..."
                required/>

            </div>

            <div className='reviewsFormSelectStar'>
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                    {/* vybirani hvezdicek 1 - 5 ze selectu */}
                    {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} </option>
                    ))}
                </select>
                <FaStar/>
            </div>

            <button type="submit" disabled={loading || !userDetails} className='reviewsFormSubmitButton'>
                {loading ? 'Loading...' : 'Odeslat'}
            </button>
        </form>
        </div>
        )}
        </div>
    );
};

export default ReviewsForm;
