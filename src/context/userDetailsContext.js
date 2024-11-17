import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';
import { useUser } from './UserContext'
import { toast } from 'react-toastify'

const useUserDetails = () => {
  const user = useUser();  // Get the authenticated user
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(projectFirestore, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("User data not found");
            toast.error("User data not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data");
        } finally {
          setLoading(false);  // Set loading to false once the data is fetched
        }
      } else {
        setLoading(false);  // Ensure loading is false even if user is not logged in
      }
    };

    if (user !== undefined) {  // Only fetch if user is not undefined
      fetchUserData();
    }
  }, [user]);

  return { userDetails, loading };
};

export default useUserDetails;
