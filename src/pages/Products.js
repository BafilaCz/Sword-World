import "./Products.css";
import { collection, onSnapshot } from "firebase/firestore";
import { projectFirestore } from '../firebase/config';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TiTick } from "react-icons/ti";
import { FaCartShopping } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import Filters from "../components/Filters";
import NothingFound from "../components/NothingFound";

const Products = ({ addToCart }) => {
    const [data, setData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [error, setError] = useState(false);

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
                setNewData(result);
                setError(false);
            }
        }, (err) => setError(err.message));

        // Cleanup funkce (nutna)
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

        setNewData(filtered);
    }

    const changeWindows = () =>{
        window.location = "/"
    }

    const handleSortBy = (type) => {
        let sortedData = [...newData]; // Create a copy of newData to avoid mutating state directly

        if (type === "priceLow") {
            // od nejnižší ceny
            sortedData.sort((a, b) => {
                const priceA = Number(a.price.replace(/\s/g, ""));
                const priceB = Number(b.price.replace(/\s/g, ""));
                return priceA - priceB;
            });
        } else if (type === "priceHigh") {
            // od nejvyšší ceny
            sortedData.sort((a, b) => {
                const priceA = Number(a.price.replace(/\s/g, ""));
                const priceB = Number(b.price.replace(/\s/g, ""));
                return priceB - priceA;
            });
        } else if (type === "reviews") {
            // podle průměrných recenzí
            sortedData.sort((a, b) => {
                const reviewA = (a.averageReview || 0);
                const reviewB = (b.averageReview || 0);
                return reviewB - reviewA;
            });
        }

        setNewData(sortedData);
    };

    const sklonovani = (count, word) => {
        if (count === 1 && word === "recenze") {
            return "recenze";
        } else if (word === "recenze") {
            return "recenzí";
        } else {
            return "";
        }
    }

    return (
        <div className='products'>
            {error && <p>{error}</p>}

            <div className="filtersAndSortingContainer">
                {/* Filtry */}
                <div className="filtersSection">
                    <Filters onFilterChange={handleFilterChange} />
                </div>

                {/* Řazeni */}
                <div className="sortingSection">
                    <button className="sortingButton" onClick={() => handleSortBy("reviews")}>Nejlépe hodnocené</button>
                    <button className="sortingButton" onClick={() => handleSortBy("priceLow")}>Nejlevnější</button>
                    <button className="sortingButton" onClick={() => handleSortBy("priceHigh")}>Nejdražší</button>
                </div>
            </div>

            {newData.length === 0 ? (
                <NothingFound />
            ) : (
                newData.map((oneProducts) => {
                    const { id, title, price, img, amount, color, averageReview, reviewCount } = oneProducts;
                    return (
                        <div className='oneProducts' key={id}>
                            <Link to={`/product/${id}`} className='productTitle'><h2 className='productTitle'>{title}</h2></Link>
                            <Link to={`/product/${id}`} className="productImgContainer"><img src={img} className='productImg' alt={title} /></Link>
                            <br />
                            <Link to={`/product/${id}`} className='productAmount'><TiTick /> Zbývá {amount} Kusů</Link>
                            <Link to={`/product/${id}`}  className="productsAverageReview">{`${averageReview || 0}`} <FaStar /></Link>
                            <Link to={`/product/${id}`}  className='productPrice'>{`${price} Kč`}</Link>
                            <button type="button" className="productCartButton" onClick={() => addToCart(oneProducts)}>
                                <span className="cartIcon"><FaCartShopping />
                                </span> Do Košíku
                            </button>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Products;