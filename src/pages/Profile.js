import React, { useState, useEffect } from 'react';
import { projectFirestore, auth} from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import useUserDetails from '../context/userDetailsContext';
import { toast } from 'react-toastify';
import defaultPfp from '../img/defaultPfp.png';
import './Profile.css';

const Profile = ({formatNumberWithSpaces}) => {
    const user = useUser();
    const { userDetails, loading } = useUserDetails();
    const [orders, setOrders] = useState([])

    const handleLogOut = async () => {
        try {
            await auth.signOut();
            window.location = "/login";
        } catch (error) {
            toast.error(error.message, { position: 'bottom-center' });
        }
    }



    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !user.uid) return;
            try {
                const ordersRef = collection(projectFirestore, 'orders');
                const q = query(ordersRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(ordersData);
                console.log(ordersData)
                console.log(user.uid)
            } catch (error) {
                toast.error('Chyba při načítání objednávek: ' + error.message);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) return <p className='loading'>Načítání...</p>;
    if (!user) return null;

    return (
        <div className='profile'>
            {userDetails ? (
                <div className='profileContent'>
                    <img 
                        src={userDetails.photo ? userDetails.photo : defaultPfp} 
                        alt='User profile' 
                        className='profileUserPhoto' 
                    />  
                    <h3 className='profileUserName'>{userDetails.firstName} {userDetails.lastName}</h3>
                    <p className='profileUserEmail'><strong>Email:</strong> {userDetails.email}</p>
                    <button className='profileLogoutButton' onClick={handleLogOut}>Odhlásit se</button>

                    <div className='profileOrders'>
                        <h4>Historie objednávek:</h4>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <div key={order.id} className='orderItem'>
                                    <p><strong>ID objednávky:</strong> {order.id}</p>
                                    <p><strong>Datum:</strong> {new Date(order.timestamp.toDate()).toLocaleDateString('cs-CZ')}</p>
                                    <p><strong>Celkem:</strong> {formatNumberWithSpaces(order.totalPrice)} Kč</p>
                                    <div className='orderProducts'>
                                        <h5>Produkty:</h5>
                                        {order.products.map((product, index) => (
                                            <div key={index} className='orderProduct'>
                                                <img src={product.img} alt={product.title} className='orderProductImage' />
                                                <p>{product.title}</p>
                                                <p>Množství: {formatNumberWithSpaces(product.numberOfItems)}</p>
                                                <p>Cena: {formatNumberWithSpaces(product.price)} Kč</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='profileNoOrdersYet'>Zatím nemáte žádné objednávky</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className='loading'> </p>
            )}
        </div>
    );
};

export default Profile;
