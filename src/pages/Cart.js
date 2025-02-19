
import React, { useState, useEffect } from 'react';
import "./Cart.css";
import Map from "../components/Map"
import { projectFirestore } from '../firebase/config';
import { addDoc, collection, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaCreditCard } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { useUser } from '../context/UserContext';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import useUserDetails from '../context/userDetailsContext';

const Cart = ({ productsInCart, increaseQuantity, decreaseQuantity, clearCart, formatNumberWithSpaces }) => {
    const parseIntegerFromString = (str) => {
        const cleanedString = str.replace(/\s+/g, '');
        return parseInt(cleanedString, 10);
    };

    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryAdress, setDeliveryAdress] = useState("");
    const [selectedDelivery, setSelectedDelivery] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");
    const [showCheckout, setShowCheckout] = useState(false);
    const { userDetails, loading } = useUserDetails();
    const user = useUser();
    const [address, setAddress] = useState('');

    const deliveryCosts = {
        osobni: 0,
        zasilkovna: 69,
        balikovna: 69,
    };

    const toggleShowCheckout = () => {
        setShowCheckout(!showCheckout);
    };



    // Calculate the initial price of products in the cart
    useEffect(() => {
        let initialPrice = 0;
        productsInCart.forEach(product => {
            initialPrice += product.numberOfItems * parseIntegerFromString(product.price);
        });
        setTotalPrice(initialPrice);
    }, [productsInCart]);

    // Update total price based on the selected delivery method
    useEffect(() => {
        if (selectedDelivery) {
            const deliveryCost = deliveryCosts[selectedDelivery] || 0;
            let initialPrice = 0;
            productsInCart.forEach(product => {
                initialPrice += product.numberOfItems * parseIntegerFromString(product.price);
            });
            setTotalPrice(initialPrice + deliveryCost);
        }
    }, [selectedDelivery, productsInCart]);

    useEffect(() => {
        if (userDetails) {
            setFirstName(`${userDetails.firstName} ${userDetails.lastName}`);
            setEmail(userDetails.email);
        }
    }, [userDetails]);

    const updateTotalPrice = (price, isIncrease) => {
        if (isIncrease) {
            setTotalPrice(prevPrice => prevPrice + parseIntegerFromString(price));
        } else {
            setTotalPrice(prevPrice => prevPrice - parseIntegerFromString(price));
        }
    };

    const CompleteOrder = async (e) => {
        e.preventDefault();

        if (!selectedPayment) {
            toast.error('Vyberte způsob platby.');
            return;
        }

        if (!selectedDelivery) {
            toast.error('Vyberte způsob doručení.');
            return;
        }

        if (!deliveryAdress.trim()) {
            toast.error('Zadejte adresu pro doručení.');
            return;
        }

        if (!user || !user.uid) {
            toast.error('Uživatel není přihlášen.');
            return;
        }

        try {
            // Add order to Firestore
            await addDoc(collection(projectFirestore, 'orders'), {
                userId: user.uid,
                userName: firstName,
                email: email,
                address: deliveryAdress,
                deliveryMethod: selectedDelivery,
                paymentMethod: selectedPayment,
                totalPrice: totalPrice,
                products: productsInCart,
                timestamp: new Date()
            });

            // Update product amounts in Firestore
            for (const product of productsInCart) {
                const productRef = doc(projectFirestore, "products", product.id);
                await updateDoc(productRef, {
                    amount: increment(-product.numberOfItems)
                });
            }

            // Delete the user's cart document
            const userCartDoc = doc(projectFirestore, "carts", user.uid);
            await deleteDoc(userCartDoc);

            toast.success('Objednávka byla úspěšně vytvořena!');
            clearCart();
            toggleShowCheckout();
        } catch (error) {
            console.error('Chyba při vytváření objednávky:', error);
            toast.error('Nastala chyba :(');
        }
    };

    if (productsInCart.length === 0) {
        return (
            <div className="cartEmptyContainer">
                <MdOutlineRemoveShoppingCart className="cartEmptyIcon" />
                <h1>Váš košík je prázdný</h1>
            </div>
          );
    }

    return (
        userDetails && (
            <div className='cartPage'>
                <div className='cartContent'>
                    {productsInCart.map((oneProduct, index) => {
                        const { id, title, price, img, numberOfItems } = oneProduct;

                        return (
                            <div className='itemsInCart' key={`${id}-${index}`}>
                                <Link to={`/product/${id}`} className='cartItemImgContainer'>
                                    <img src={img} alt={title} className='cartItemImg' />
                                </Link>
                                <Link to={`/product/${id}`} className='cartItemTitle'>{title}</Link>
                                <p className='cartItemPrice'>Cena: {price} Kč</p>
                                <p className='cartItemCount'>{numberOfItems} x</p>
                                <button
                                    onClick={() => {
                                        increaseQuantity(id);
                                        updateTotalPrice(price, true);
                                    }}
                                >
                                    <FaPlus />
                                </button>
                                <button
                                    onClick={() => {
                                        decreaseQuantity(id);
                                        updateTotalPrice(price, false);
                                    }}
                                >
                                    <FaMinus />
                                </button>
                            </div>
                        );
                    })}

                    <div className='cartBuyAll'>
                        <div className='buyAllPriceContent'>
                            <p className='buyAllPriceText'>Cena za vše: </p>
                            <p className='buyAllPrice'>{formatNumberWithSpaces(totalPrice)} Kč</p>
                        </div>
                        <button type='button' className='buttonBuyAll' onClick={toggleShowCheckout}>Pokračovat</button>
                    </div>

                    {showCheckout && (
                        <div className='cartCheckout'>
                            <form action="submit" onSubmit={CompleteOrder} className="cartCheckoutForm">
                                <button className="closeCheckoutButton" onClick={toggleShowCheckout}>
                                    X
                                </button>
                                <h2 className="cartCheckoutTitle">Vyplňte údaje</h2>

                                <p className="cartCheckoutAdress">Jméno</p>
                                <input
                                    type="text"
                                    value={`${userDetails.firstName} ${userDetails.lastName}`}
                                    className='cartCheckoutAdressInput'
                                    onInput={(e) => setFirstName(e.target.value)}
                                />

                                <p className="cartCheckoutAdress">Email</p>
                                <input
                                    type="text"
                                    value={`${userDetails.email}`}
                                    className='cartCheckoutAdressInput'
                                    onInput={(e) => setEmail(e.target.value)}
                                />

                                <p className="cartCheckoutAdress">Adresa pro doručení</p>

                                <Map onLocationSelect={setDeliveryAdress} />


                                <p className="cartCheckoutDelivery">Zvolte způsob doručení</p>
                                <div className="deliveryOptions">
                                    <label>
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value="osobni"
                                            checked={selectedDelivery === "osobni"}
                                            onChange={() => setSelectedDelivery("osobni")}
                                            required
                                        /> Osobní odběr <b>Zdarma</b>
                                        <img
                                            src="https://firebasestorage.googleapis.com/v0/b/swordworld-10d4f.appspot.com/o/osobni.webp?alt=media&token=1d882ddb-1e5d-4977-84a0-8c8c29790c21"
                                            alt="osobni-odber"
                                            referrerPolicy='no-referrer'
                                        />
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value="zasilkovna"
                                            checked={selectedDelivery === "zasilkovna"}
                                            onChange={() => setSelectedDelivery("zasilkovna")}
                                            required
                                        /> Zásilkovna <b>69 Kč</b>
                                        <img
                                            src="https://firebasestorage.googleapis.com/v0/b/swordworld-10d4f.appspot.com/o/zasilkovna.webp?alt=media&token=8b7278b2-8f47-4f27-80ca-c9d7a7c3a234"
                                            alt="zasilkovna"
                                            referrerPolicy='no-referrer'
                                        />
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value="balikovna"
                                            checked={selectedDelivery === "balikovna"}
                                            onChange={() => setSelectedDelivery("balikovna")}
                                            required
                                        /> Balíkovna <b>69 Kč</b>
                                        <img
                                            src="https://firebasestorage.googleapis.com/v0/b/swordworld-10d4f.appspot.com/o/balikovna.png?alt=media&token=5c6c5391-f575-4b20-a0d9-67a1548f1518"
                                            alt="balikovna"
                                            referrerPolicy='no-referrer'
                                        />
                                    </label>
                                </div>

                                <p className="cartCheckoutPayment">Zvolte způsob platby</p>
                                <div className="paymentOptions">
                                    <label>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="qr"
                                            checked={selectedPayment === "qr"}
                                            onChange={() => setSelectedPayment("qr")}
                                            required
                                        />Qr kód
                                        <BsQrCode />
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="bank"
                                            checked={selectedPayment === "bank"}
                                            onChange={() => setSelectedPayment("bank")}
                                            required
                                        /> Bankovní převod
                                        <CiBank />
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={selectedPayment === "card"}
                                            onChange={() => setSelectedPayment("card")}
                                            required
                                        /> Platební kartou
                                        <FaCreditCard />
                                    </label>
                                </div>
                                <input type="submit" value={`Zaplatit (celkem ${formatNumberWithSpaces(totalPrice)} Kč)`} />
                            </form>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default Cart;