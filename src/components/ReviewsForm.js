import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';
import useUserDetails from '../context/userDetailsContext'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa";


const ReviewsForm = ({ productId }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const { userDetails, loading } = useUserDetails();  // Get user details
    const user = useUser()

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
                userName: `${userDetails.firstName} ${userDetails.lastName}`,  // Use user name from Firestore or fallback
                rating,
                comment,
                timestamp: serverTimestamp(),
            });

            setComment('');
            setRating(5);
            toast.success('Recenze byla úspěšně přidána!');
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('nastala chyba :(');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Napište recenzi..."
                required
            />
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num}<FaStar/></option>
                ))}
            </select>
            <button type="submit" disabled={loading || !userDetails}>
                {loading ? 'Loading...' : 'Odeslat'}
            </button>
        </form>
    );
};

export default ReviewsForm;
