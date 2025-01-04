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



const OneProduct = ({addToCart}) => {
    

    
    const [data, setData] = useState({})
    const [error, setError] = useState(false)
    const { id } = useParams()


    useEffect(() => {
      const fetchData = async () => {
          try {
              const docRef = doc(projectFirestore, "products", id);
              const document = await getDoc(docRef);

              if (!document.exists()) {
                setError(true)
                return

            } else {
                setData(document.data());
              }
          } catch (err) {
              setError(err.message);
          }
      };

      fetchData();
  }, [id, projectFirestore]);


  return (
    error ? <NoPage /> : (

    <div className='oneProduct'>
        {error && <p>{error}</p>}
        <h1 className='oneProductTitle'>{data.title}</h1>
        <img className='oneProductImg' src={data.img} alt={`${data.title}`}/>
        <h3 className='oneProductDescription'>{data.description}</h3>
        <p className='oneProductAmount'><TiTick /> Zbývá {data.amount} Kusů</p>
        <p className='oneProductPrice'>{`${data.price} Kč`}</p>
        <button type="button" className="oneProductCartButton" onClick={()=>addToCart(data)}><span className="oneProductcartIcon"><FaCartShopping /></span> Do Košíku</button>

        <ReviewsList productId={id} />
        <ReviewsForm productId={id} />

    
    </div>
    )
  )
}

export default OneProduct