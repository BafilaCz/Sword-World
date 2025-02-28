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
import Upload from './pages/Upload';
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

  // Fetch the user's cart from Firestore
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

  // Fetch all products from Firestore (if needed)
  const fetchProducts = async () => {
    const productsCollection = collection(projectFirestore, "products");
    const snapshot = await getDocs(productsCollection);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the Firestore document ID
      ...doc.data(), // Include all other fields from the document
    }));

    return products;
  };

  // Add a product to the cart
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
    toast.dismiss()
    toast.success("Přidáno do košíku")
  };

  // pridani mnozstvi zbozi
  const increaseQuantity = async (productId) => {
    if (!user) {
        toast.error("Please log in to update the cart");
        return;
    }

    setProductsInCart(prevProductsInCart => {
        const updatedProducts = prevProductsInCart.map(p => 
            p.id === productId ? { ...p, numberOfItems: p.numberOfItems + 1 } : p
        );

        // update v databazi
        const userCartDoc = doc(projectFirestore, "carts", user.uid);
        setDoc(userCartDoc, { cartItems: updatedProducts }, { merge: true });

        return updatedProducts;
    });

    setInCart(prevInCart => prevInCart + 1);
}

  // Decrease the quantity of a product in the cart
  const decreaseQuantity = async (productId) => {
    if (!user) {
      toast.error("Please log in to update the cart");
      return;
    }
  
    setProductsInCart((prevProductsInCart) => {
      const updatedProducts = prevProductsInCart.map((p) =>
        p.id === productId ? { ...p, numberOfItems: p.numberOfItems - 1 } : p
      ).filter((p) => p.numberOfItems > 0); // smazat pokud mnozstvi < 0
  
      // Update the cart in Firestore
      const userCartDoc = doc(projectFirestore, "carts", user.uid);
      setDoc(userCartDoc, { cartItems: updatedProducts }, { merge: true });
  
      return updatedProducts;
    });
  
    // Use functional update for inCart to ensure consistency
    setInCart((prevInCart) => prevInCart - 1);
  }

  // smazani veci z kosiku
  const clearCart = async () => {
    if (!user) return;
    setProductsInCart([]);
    setInCart(0);

    // Clear Firestore cart document
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
          <Route path="upload" element={<Upload />} />
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