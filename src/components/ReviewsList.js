import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';
import "./ReviewsList.css"
import { FaStar } from "react-icons/fa";

const ReviewsList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const q = query(collection(projectFirestore, 'reviews'), where('productId', '==', productId));
            const querySnapshot = await getDocs(q);
            const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReviews(reviewsData);
        };

        fetchReviews();
    }, [productId]);

    return (
        <div className='reviewsList'>
            <h3 className='reviewsListTitle'>Recenze:</h3>
            {reviews.map((review) => (
                <div className='reviewsListReview' key={review.id}>
                    <p className='reviewsListUsername'><strong>{review.userName}</strong> - {review.rating} <FaStar/> </p>
                    <p className='reviewsListComment'>{review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewsList;
