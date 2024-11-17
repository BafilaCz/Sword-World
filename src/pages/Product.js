import React from 'react'
import { useParams } from 'react-router-dom'
import { projectFirestore } from '../firebase/config'
import { useState, useEffect } from 'react'
import { doc, getDoc } from "firebase/firestore";



const Product = () => {
    

    
    const [data, setData] = useState({})
    const [error, setError] = useState(false)
    const { id } = useParams()


    useEffect(() => {
      const fetchData = async () => {
          try {
              const docRef = doc(projectFirestore, "products", id);
              const document = await getDoc(docRef);

              if (!document.exists()) {
                  setError("Nenašli jsme žádaný produkt");
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
    <div>
        {error && <p>{error}</p>}
        <h1>{data.title}</h1>
        <h3>{data.description}</h3>
        <img src={data.img} alt="" />

    </div>
  )
}

export default Product