import React from 'react'
import { projectFirestore, storage } from '../firebase/config'

const Upload = () => {

    

    const addDocuments = async (title, description, price, tags, color, amount) => {
    const collectionRef = projectFirestore.collection('products');
  
  const documents = [
    { title: title, img: '', description: description, price: price, tags: tags, color: color, amount: amount },
    // Add more documents as needed
  ];

  const batch = projectFirestore.batch();

  documents.forEach((doc) => {
    const docRef = collectionRef.doc(); // Automatically generate an ID
    batch.set(docRef, doc);
  });

  try {
    await batch.commit();
    console.log('Documents successfully written!');
  } catch (error) {
    console.error('Error writing documents: ', error);
  }
};





  return (




    <div><button onClick={() => {addDocuments(`Katana Brown Kimura`, `Čepel vyrobená z uhlíkové oceli má na povrchu tradiční drážku bo-hi ("dutý žlábek") a dřevěná rukojeť je pečlivě zdobená a obsahuje tsuba (záštitu ruky), menuki (ozdobné prvky pod záštitou rukojeti) a tmavě hnědou tsuka-ito (šňůru kolem rukojeti). Pochva meče je vyrobena z černého a lakovaného dřeva a obsahuje charakteristickou šňůru sageo pro připevnění k opasku. Tento dekorativní nebo sběratelský meč není vhodný ke skutečnému použití!`, "3 999", [], "brown", 20,)}}>GTRUJFJGNRUJJHNMRJUHHNJM</button></div>
  )
}

export default Upload