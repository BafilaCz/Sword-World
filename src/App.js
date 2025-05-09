import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { projectFirestore, auth } from "./firebase/config";
import { doc, updateDoc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { UserProvider } from './context/UserContext';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import Products from './pages/Products';
import OneProduct from './pages/OneProduct';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  const [inCart, setInCart] = useState(0);
  const [productsInCart, setProductsInCart] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
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
  }, []);

  // Fetchnuti user cart z databaze
  const fetchCart = async (user) => {
    if (user) {
      const userCartDoc = doc(projectFirestore, "carts", user.uid);
      const docSnap = await getDoc(userCartDoc);

      if (docSnap.exists()) {
        const cartData = docSnap.data().cartItems;
        setProductsInCart(cartData);
        const totalItems = cartData.reduce((sum, product) => sum + product.numberOfItems, 0);
        setInCart(totalItems);
      } else {
        console.log("Cart document does not exist.");
      }
    }
  };


  // přidání produktů do košíku
  const addToCart = async (product) => {
    if (!user) {
      toast.dismiss()
      toast.error("Pro přidání do košíku se přihlašte");
      return;
    }

  
    if (product.amount > 0){
      // provede se jen pokud je amount (zbývajici kusy) > 0

    const updatedProductsInCart = [...productsInCart];
    const existingProductIndex = updatedProductsInCart.findIndex(p => p.id === product.id);

    if (existingProductIndex !== -1) {
      updatedProductsInCart[existingProductIndex].numberOfItems += 1;
    } else {
      updatedProductsInCart.push({ ...product, numberOfItems: 1 });
    }
    setProductsInCart(updatedProductsInCart);
    // uloží kosik do databaze
    const userCartDoc = doc(projectFirestore, "carts", user.uid);
    await setDoc(userCartDoc, { cartItems: updatedProductsInCart }, { merge: true });

    setInCart(inCart + 1)

    toast.dismiss()
    toast.success("Přidáno do košíku")
    }
    else{
      toast.dismiss()
      toast.error("zboží momentálně nemáme na skladě")
    }
  }


  // přidání mnozstvi zbozi v kosiku
  const increaseQuantity = async (product) => {
    if (!user) {
        toast.error("Please log in to update the cart");
        return;
    }


    setProductsInCart(prevProductsInCart => {
        const updatedProducts = prevProductsInCart.map(p => 
            p.id === product.id ? { ...p, numberOfItems: p.numberOfItems + 1 } : p
        );

        // update kosiku v db
        const userCartDoc = doc(projectFirestore, "carts", user.uid);
        setDoc(userCartDoc, { cartItems: updatedProducts }, { merge: true });

        return updatedProducts;
    });
   // updatuje indikator mnozstvi v kosiku (inCart)
    setInCart(prevInCart => prevInCart + 1)
}

  // odebrani mnozstvi zbozi v kosiku
  const decreaseQuantity = async (product) => {
    if (!user) {
      toast.error("Please log in to update the cart");
      return;
    }
   
    setProductsInCart((prevProductsInCart) => {
      const updatedProducts = prevProductsInCart.map((p) =>
        p.id === product.id ? { ...p, numberOfItems: p.numberOfItems - 1 } : p
      ).filter((p) => p.numberOfItems > 0); // smazat pokud mnozstvi < 0
  
      // update kosiku v db
      const userCartDoc = doc(projectFirestore, "carts", user.uid);
      setDoc(userCartDoc, { cartItems: updatedProducts }, { merge: true });
      return updatedProducts;
    });
  
    // updatuje indikator mnozstvi v kosiku (inCart)
    setInCart((prevInCart) => prevInCart - 1)
  }

  // smazani veci z kosiku
  const clearCart = async () => {
    if (!user) return;
    setProductsInCart([]);
    setInCart(0);

    // Smazani z db
    const userCartDoc = doc(projectFirestore, "carts", user.uid);
    await setDoc(userCartDoc, { cartItems: [] }, { merge: true });
  }

  // funkce pro formátování stringu aby dělal mezery po třech číslicích
  const formatNumberWithSpaces = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  } 
  

  return (
    <BrowserRouter>
      <UserProvider>
        <Header inCart={inCart} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NoPage />} />
          <Route path="products" element={<Products inCart={inCart} addToCart={addToCart} productsInCart={productsInCart} />} />
          <Route
            path="cart"
            element={
              <Cart
                productsInCart={productsInCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                formatNumberWithSpaces = {formatNumberWithSpaces}
                clearCart={clearCart}
              />
            }
          />
          <Route path="product/:id" element={<OneProduct addToCart={addToCart} />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login inCart={inCart} productsInCart={productsInCart} />} />
          <Route path="profile" element={<Profile
            formatNumberWithSpaces = {formatNumberWithSpaces}

          />} />
        </Routes>
        <Footer />
        <ToastContainer />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;