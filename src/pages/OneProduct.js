import React from 'react'
import "./OneProduct.css"
import { useParams } from 'react-router-dom'
import { projectFirestore } from '../firebase/config'
import { useState, useEffect } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { TiTick } from "react-icons/ti";
import { FaCartShopping } from "react-icons/fa6";
import NoPage from './NoPage'
import ReviewsForm from '../components/ReviewsForm';
import ReviewsList from '../components/ReviewsList';
import { FaStar } from "react-icons/fa";




const OneProduct = ({addToCart}) => {
    

    
    const [data, setData] = useState({})
    const [error, setError] = useState(false)
    const { id } = useParams()
    const [averageReview, setAverageReview] = useState(null);
    const [reviewCount, setReviewCount] = useState(null);


    useEffect(() => {
      const fetchData = async () => {
          try {
              const docRef = doc(projectFirestore, "products", id);
              const document = await getDoc(docRef);


              if (!document.exists()) {
                setError(true)
                return

            } else {
                const productData = document.data();
                setData(productData)
                setAverageReview(productData.averageReview || 0)
                setReviewCount(productData.reviewCount || 0)
              }
          } catch (err) {
              setError(err.message);
          }
      };

      fetchData();
  }, [id]);

  const sklonovani = (count, word) => {
    if (count === 1 && word === "recenze") {
        return "recenze";
    } else if (word === "recenze") {
        return "recenzí";
    } else {
        return "";
    }
}


  return (
    error ? <NoPage /> : (

    <div className='oneProduct'>
        {error && <p>{error}</p>}
        <h1 className='oneProductTitle'>{data.title}</h1>
        <img className='oneProductImg' src={data.img} alt={`${data.title}`}/>
        <h3 className='oneProductDescription'>{data.description}</h3>
        <p className='oneProductAmount'><TiTick /> Zbývá {data.amount} Kusů</p>
        <p className='oneProductReviewCount'> {reviewCount} {sklonovani(reviewCount, "recenze")} </p>
        <p className='oneProductReviewRating'> {averageReview} <FaStar/></p>
        <p className='oneProductPrice'>{`${data.price} Kč`}</p>
        <button type="button" className="oneProductCartButton" onClick={()=>addToCart(data)}><span className="oneProductcartIcon"><FaCartShopping /></span> Do Košíku</button>
        
        <h3 className='oneProductReviewsListTitle'>Recenze:</h3>
        <ReviewsForm productId={id} />
        <ReviewsList productId={id} />
    </div>
    )
  )
}

export default OneProduct