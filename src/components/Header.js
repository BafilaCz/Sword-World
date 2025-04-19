import "./Header.css"; 
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import logo from '../img/banner.png';
import useUserDetails from '../context/userDetailsContext'
import { collection, onSnapshot } from "firebase/firestore";
import { projectFirestore } from '../firebase/config'
import { MdAccountCircle } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { NavLink, Link} from "react-router-dom";
import { useUser } from '../context/UserContext';


const Header = ({inCart}) => {

  const user = useUser()
  const { userDetails, loading } = useUserDetails();
  const [data, setData] = useState([])
  const [error, setError] = useState(false)
  const [searchedWord, setSearchedWord] = useState("")
  const [searchedProducts, setSearchedProducts] = useState([])


  useEffect(() => {
    // nastavi do "data" data o produktech z databaze
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
    // cleanup, nutny pro predchazeni chybam
    return () => unsubscribe();
  }, [])

  // 
  const handleInput = (e) => {
    const searchTerm = e.target.value;
    setSearchedWord(searchTerm);

    if (searchTerm.trim() === "") {
        setSearchedProducts([])
    } 
    
    else {
        let result = data.filter((oneProduct) =>
            oneProduct.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setSearchedProducts(result);
    } 
  }
  // vyhledavani v db přes hledany vyraz
  const handleSearch = (e) => {
    e.preventDefault()
  
    if (searchedWord.trim() === "") {
      toast.warning("Please enter a search term")
      return;
    }
    console.log("Searched Products: ", searchedProducts)

    setSearchedWord("")
    setSearchedProducts([])
  }

  const [burgerActive, setBurgerActive] = useState(false)
  const burgerHandler = () => {
    setBurgerActive(!burgerActive);
  }
  const handleCart = () => {
    if(user){ 
      setBurgerActive(false)
      window.location = "/cart"
    }
    else{
      setTimeout(() => {
        window.location = "/login"
      }, 500)
      
     
    }
  }
  const handleAccount = () => {
    if(user){
      setBurgerActive(false)
      window.location = "/profile"
    }
    else{
      setTimeout(() => {
        window.location = "/login"
      }, 500)
    }
  }
  const clearSearchedWord = () =>{
    setSearchedWord("")
    setSearchedProducts([])
  }

  return (
    <header className="header">
      <nav className="pcNav">
        <div className="upperNav">
          <Link to={"/"}>
          <img src={logo} alt="logo" className="logo" />
          </Link>

          <form className="searchBar" onSubmit={handleSearch}>
          <div className="searchInputContainer">
            <input type="text" placeholder="Hledat..." className="searchInput" value={searchedWord} onInput={handleInput}/>
            <div className="searchedProductsContent">
            {searchedProducts.map((oneProduct)=>{
              const {id, title, price, img, amount} = oneProduct
              return <div className='searchedProducts' key={id}>
                <Link to={`product/${id}`} className="searchedProductLink" onClick={clearSearchedWord}>{title}</Link>
              </div>
            })}
            </div>
          </div>


            
          </form>
       
          <div className="cart link upperLink" onClick={handleCart}>
          <FaCartShopping /> 
          <br />Košík
          <p className="inCart" style={{ display: inCart === 0 ? 'none' : 'flex' }}>{inCart}</p>
          </div>

          <div className="account link upperLink" onClick={handleAccount} > 
          {userDetails? <img src={userDetails.photo} alt="" className="headerPfp" referrerPolicy="no-referrer"/> : <MdAccountCircle/>}
          <br /> {userDetails ? userDetails.firstName : "Account"}
          </div>

        </div>



        <div className="lowerNav">
          <div className="allLinks">
            <NavLink to={"/"}className="link lowerLink">Domů</NavLink>
            <NavLink to={"products"} className="link lowerLink">Produkty</NavLink>
          </div>
        </div>
      </nav>
{/* MOBILY */}
      <nav className="mobileNav">
        <div className="upperNav">
          <Link to={"/"} onClick={()=> setBurgerActive(false)}>
          <img src={logo} alt="logo" className="logo" />
          </Link>

          <div onClick={handleCart} className="cart link upperLink">
          <FaCartShopping /> <br /> Košík
          <p className="inCart" style={{ display: inCart === 0 ? 'none' : 'flex' }}>{inCart}</p>
          </div>
        </div>

        <div className="lowerNav">
          <button className="burger" onClick={burgerHandler}>
            ☰
          </button>

          <div className={`allLinks ${burgerActive ? 'isActive' : ''}`}>
          <form className="searchBar" onSubmit={handleSearch}>
          <div className="searchInputContainer">
            <input type="text" placeholder="Hledat..." className="searchInput" value={searchedWord} onInput={handleInput}/>
            <div className="searchedProductsContent">
            {searchedProducts.map((oneProduct)=>{
              const {id, title, price, img, amount} = oneProduct
              return <div className='searchedProducts' key={id}>
                <Link to={`product/${id}`} className="searchedProductLink" onClick={clearSearchedWord}>{title}</Link>
              </div>
            })}
            </div>
          </div>

            
          </form>
            <NavLink to={"/"} className="link lowerLink" onClick={burgerHandler}>Domů</NavLink>
            <NavLink to={"products"} className="link lowerLink" onClick={burgerHandler}>Produkty</NavLink>
            <NavLink onClick={handleAccount} className="account link lowerLink">Účet</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
