import React from 'react';
import "./Cart.css";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from 'react-toastify';

const Cart = ({ productsInCart, increaseQuantity, decreaseQuantity }) => {
    const parseIntegerFromString = (str) => {
        // Convert a string with spaces to an integer
        const cleanedString = str.replace(/\s+/g, '');
        return parseInt(cleanedString, 10);
    };

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Calculate the initial total price
        let initialPrice = 0;
        productsInCart.forEach(product => {
            initialPrice += product.numberOfItems * parseIntegerFromString(product.price);
        });
        setTotalPrice(initialPrice);
    }, [productsInCart]);

    const updateTotalPrice = (price, isIncrease) => {
        if (isIncrease) {
            setTotalPrice(prevPrice => prevPrice + parseIntegerFromString(price));
        } else {
            setTotalPrice(prevPrice => prevPrice - parseIntegerFromString(price));
        }
    };

    return (
        <div className='cartPage'>
            <div className='cartContent'>
                {productsInCart.map((oneProduct) => {
                    const { id, title, price, img, numberOfItems } = oneProduct;

                    return (
                        <div className='itemsInCart' key={id}>
                            <Link to="/" className='cartItemImgContainer'>
                                <img src={img} alt="" className='cartItemImg' />
                            </Link>
                            <Link to="/" className='cartItemTitle'>{title}</Link>
                            <p className='cartItemPrice'>Cena: {price} Kč</p>

                            <p className='cartItemCount'>{numberOfItems} x</p>

                            <button onClick={() => {
                                increaseQuantity(id);
                                updateTotalPrice(price, true);
                            }}>
                                <FaPlus />
                            </button>

                            <button onClick={() => {
                                decreaseQuantity(id);
                                updateTotalPrice(price, false);
                            }}>
                                <FaMinus />
                            </button>
                        </div>
                    );
                })}

                <div className='cartBuyAll'>
                    <div className='buyAllPriceContent'>
                        <p className='buyAllPriceText'>Cena za vše: </p>
                        <p className='buyAllPrice'>{totalPrice} Kč</p>
                    </div>
                    <button type='button' className='buttonBuyAll'>Pokračovat</button>
                </div>
            </div>
        </div>
        
    );
}

export default Cart;
