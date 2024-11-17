import "./Products.css"; 
import { collection, onSnapshot } from "firebase/firestore";
import { projectFirestore } from '../firebase/config'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TiTick } from "react-icons/ti";
import { FaCartShopping } from "react-icons/fa6";
import Filters from "../components/Filters"



const Products= ({addToCart}) => {
const [data, setData] = useState([])
const [error, setError] = useState(false)

// filtery


const addFilterOption = (data, resultArray, option) => {
  data.forEach((oneProduct) => {
    if (!resultArray.includes(oneProduct[option])) {
      resultArray.push(oneProduct[option])
      console.log(resultArray)
    }
  
    
  })
}


const colorOptions =[]
addFilterOption(data, colorOptions, "color")

//


useEffect(() => {
  const colRef = collection(projectFirestore, "products");
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      setError("Zadne produkty nebyly nalezeny");
      setData([]);
    } else {
      let result = [];
      snapshot.docs.forEach((oneProduct) => {
        result.push({ id: oneProduct.id, ...oneProduct.data() });
      });
      setData(result);
      setError(false);
    }
  }, 
  (err) => setError(err.message));
  

  // Cleanup subscription on unmount
  return () => unsubscribe();
}, []);




  return (
    <div className='products'>
        {error && <p>{error}</p>}

        {/* filtry */}
        <div className="filtersSection">
        <Filters/>
        </div>
        {/*  */}


        {data.map((oneProduct)=>{
          const {id, title, price, img, amount, color} = oneProduct
          return <div className='oneProduct' key={id}>
            
            <Link to={`/product/${id}`} className='productTitle'> {<h2 className='productTitle'> {title} </h2>} </Link>
            <br />
            <Link to={`/product/${id}`} className="productImgContainer">{<img src={img} className='productImg' />}</Link>
            <br />
            <p className='productAmount'><TiTick /> Zbývá {amount} Kusů</p>
            <br />
            
            <p className='productPrice'>{`${price} Kč`}</p>

            <button type="button" className="productCartButton" onClick={()=>addToCart(oneProduct)}><span className="cartIcon"><FaCartShopping /></span> Do Košíku</button>




          </div>
        })}
    </div>
  )
}

export default Products