import {BrowserRouter, Routes, Route, } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { projectFirestore, auth } from "./firebase/config";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import { UserProvider } from './context/UserContext';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import Products from './pages/Products'
import Product from './pages/Product'
import Upload from './pages/Upload'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'



function App() {

  const [inCart, setInCart] = useState(0)
  const [productsInCart, setProductsInCart] = useState([])
  

  const [user, setUser] = useState("")
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // pokud je user lognutý, nastaví ho to do user (myslím)
      setUser(user)
    })
  },[])

  useEffect(() => {
    const fetchCart = async (user) => {
      if (user) {
        const userCartDoc = doc(projectFirestore, "carts", user.uid);
        const docSnap = await getDoc(userCartDoc);
  
        if (docSnap.exists()) {
          const cartData = docSnap.data().cartItems;
          setProductsInCart(cartData);
          const totalItems = cartData.reduce((sum, product) => sum + product.numberOfItems, 0);
          setInCart(totalItems);
        }
      }
    };
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchCart(user);
      } else {
        setProductsInCart([]);
        setInCart(0);
      }
    });
  
    return () => unsubscribe();
  }, [])

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to the cart");
      return;
    }
  
    setInCart(inCart + 1);
  
    const updatedProductsInCart = [...productsInCart];
    const existingProductIndex = updatedProductsInCart.findIndex(p => p.id === product.id);
  
    if (existingProductIndex !== -1) {
      updatedProductsInCart[existingProductIndex].numberOfItems += 1;
    } else {
      updatedProductsInCart.push({ ...product, numberOfItems: 1 });
    }
  
    setProductsInCart(updatedProductsInCart);
  
    // Save the updated cart to Firestore
    const userCartDoc = doc(projectFirestore, "carts", user.uid);
    await setDoc(userCartDoc, { cartItems: updatedProductsInCart }, { merge: true });
  };

  const increaseQuantity = async (productId) => {
        // funkce na zvýšení počtu kusů předmětu v košíku

    if (!user) {
      toast.error("Please log in to update the cart");
      return;
    }
  
    setProductsInCart(prevProductsInCart => {
      const updatedProducts = [...prevProductsInCart];
      const productIndex = updatedProducts.findIndex(p => p.id === productId);
  
      if (productIndex !== -1) {
        updatedProducts[productIndex].numberOfItems += 1;
        setInCart(inCart + 1);
      }
  
      // Update the cart in Firestore
      const userCartDoc = doc(projectFirestore, "carts", user.uid);
      setDoc(userCartDoc, { cartItems: updatedProducts }, { merge: true });
  
      return updatedProducts;
    });
  };

  const decreaseQuantity = async (productId) => {
    // funkce na snížení počtu kusů předmětu v košíku
    if (!user) {
      toast.error("Please log in to update the cart");
      return;
    }
  
    setProductsInCart(prevProductsInCart => {
      const updatedProducts = [...prevProductsInCart];
      const productIndex = updatedProducts.findIndex(p => p.id === productId);
  
      if (productIndex !== -1) {
        if (updatedProducts[productIndex].numberOfItems > 1) {
          updatedProducts[productIndex].numberOfItems -= 1;
          setInCart(inCart - 1);
        } else {
          // Remove the product if the quantity is 1 or less
          updatedProducts.splice(productIndex, 1);
          setInCart(inCart - 1);
        }
  
        // Update the cart in Firestore
        const userCartDoc = doc(projectFirestore, "carts", user.uid);
        setDoc(userCartDoc, { cartItems: updatedProducts }, { merge: true });
      }
  
      return updatedProducts;
    });
  };
  


  
  return (
  
    <BrowserRouter>
      <UserProvider>
      <Header inCart={inCart}/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NoPage />} /> 
        <Route path="upload" element={<Upload />} /> 
        <Route path="products" element={<Products inCart={inCart} addToCart={addToCart} productsInCart={productsInCart}/>} /> 
        <Route path="cart" element={<Cart productsInCart={productsInCart} increaseQuantity={increaseQuantity}
         decreaseQuantity={decreaseQuantity}/>} />
        <Route path="product/:id" element={<Product/>} /> 
        <Route path="register" element={<Register/>} /> 
        <Route path="login" element={<Login inCart={inCart} productsInCart={productsInCart}/>} /> 
        <Route path="profile" element={<Profile/>} /> 
      </Routes>

      <Footer/>
      <ToastContainer/>
      </UserProvider>


    </BrowserRouter>
  )
}
  
export default App