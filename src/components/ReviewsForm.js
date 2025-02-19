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
    const { userDetails, loading } = useUserDetails(); // Get user details
    const [averageReview, setAverageReview] = useState(null);
    const [reviewCount, setReviewCount] = useState(null);
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
            const currentAverage = productData.averageReview || 0; // Default to 0 if not set
            const currentCount = productData.reviewCount || 0; // Default to 0 if not set

            // Calculate the new average
            const newAverage = ((currentAverage * currentCount) + newRating) / (currentCount + 1);
            const roundedAverage = Math.round(newAverage * 10) / 10; // Round to 1 decimal place

            // Update Firestore
            await updateDoc(productRef, {
                reviewCount: increment(1), // Increment review count
                averageReview: roundedAverage, // Update the average review
            });

            // Update local state (optional, for immediate UI feedback)
            setAverageReview(roundedAverage);
            setReviewCount(currentCount + 1);
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

            await updateProductReview(productId, rating); // Update the product review
            window.location.reload()
            // řefreshne stránku aby se zobrazila přidaná recenze
            // toast.success('Recenze byla úspěšně přidána!');
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Nastala chyba :(');
        }
    };

    useEffect(() => {
        const fetchAverageReview = async () => {
            const productRef = doc(projectFirestore, "products", productId);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                setAverageReview(productSnap.data().averageReview || 0.0); // Default to 0.0 if not set
                setReviewCount(productSnap.data().reviewCount || 0); // Default to 0 if not set
            } else {
                console.log("No such document!");
            }
        };

        fetchAverageReview();
    }, [productId]);
    
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
