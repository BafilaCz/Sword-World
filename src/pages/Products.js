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
const [filteredData, setFilteredData] = useState([])
const [error, setError] = useState(false)

// filtery

//



useEffect(() => {
  const colRef = collection(projectFirestore, "products");
  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      setError("Zadne produkty nebyly nalezeny");
      setData([]);
    } else {
      let result = [];
      snapshot.docs.forEach((oneProducts) => {
        result.push({ id: oneProducts.id, ...oneProducts.data() });
      });
      setData(result);
      setFilteredData(result);
      setError(false);
    }
  }, 
  (err) => setError(err.message));
  

  // Cleanup subscription on unmount
  return () => unsubscribe();
}, []);





const handleFilterChange = (filters) => {
  const { priceRange, selectedTags, selectedColor } = filters;

  const filtered = data.filter((product) => {
    const matchesPrice =
      Number(product.price.replace(/\s/g, "")) >= priceRange.min &&
      Number(product.price.replace(/\s/g, "")) <= priceRange.max;

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => product.tags.includes(tag));

    const matchesColor =
      !selectedColor || product.color === selectedColor;

    return matchesPrice && matchesTags && matchesColor;
  });

  setFilteredData(filtered);
}



  return (
    <div className='products'>
        {error && <p>{error}</p>}

        {/* filtry */}
        <div className="filtersSection">
        <Filters onFilterChange={handleFilterChange} />
        </div>
        {/*  */}


        {filteredData.map((oneProducts)=>{
          const {id, title, price, img, amount, color} = oneProducts
          return <div className='oneProducts' key={id}>
            
            <Link to={`/product/${id}`} className='productTitle'> {<h2 className='productTitle'> {title} </h2>} </Link>
            <br />
            <Link to={`/product/${id}`} className="productImgContainer">{<img src={img} className='productImg' />}</Link>
            <br />
            <p className='productAmount'><TiTick /> Zbývá {amount} Kusů</p>
            <br />
            
            <p className='productPrice'>{`${price} Kč`}</p>

            <button type="button" className="productCartButton" onClick={()=>addToCart(oneProducts)}><span className="cartIcon"><FaCartShopping /></span> Do Košíku</button>




          </div>
        })}
    </div>
  )
}

export default Products