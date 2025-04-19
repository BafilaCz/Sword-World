import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';
import "./ReviewsList.css"
import { FaStar } from "react-icons/fa";

const ReviewsList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // ziskavani recenzi z db
        const fetchReviews = async () => {
            const q = query(collection(projectFirestore, 'reviews'), where('productId', '==', productId));
            const querySnapshot = await getDocs(q);
            const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReviews(reviewsData);
        };
        fetchReviews();
    }, [productId]);

    // formatovani data a času do českeho rozhrani
    const formatter = new Intl.DateTimeFormat('cs-CZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
    
    return (
        <div className='reviewsList'>
            {reviews.map((review) => (
                <div className='reviewsListReview' key={review.id}>
                    <p className="reviewsListTimestamp">{formatter.format(review.timestamp.toDate()).toString()}</p>
                    <div className='reviewsListNameAndImg'>
                        <img src={review.photo} alt="userProfilePic" referrerPolicy="no-referrer" />
                        <p className='reviewsListUsername'>
                            <strong>{review.userName}</strong> - {review.rating} <FaStar />
                        </p>
                    </div>
                    <p className='reviewsListComment'>{review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewsList;
