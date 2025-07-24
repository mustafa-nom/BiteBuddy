
// functions needed from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, collection, addDoc, getDocs,} from 'firebase/firestore';
import 'dotenv/config'; 
import {
  doc, deleteDoc,
  updateDoc, deleteField, arrayRemove,
  writeBatch, 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

// Get a list of cities from your database
async function addRecipe() {
  try {
    const ref = await addDoc(collection(db, 'pizza'), {
      name: 'Margherita',
      ingredients: ['tomato sauce', 'mozzarella cheese', 'fresh basil'],
      price: 8.99,
      image: 'image_url_here',
    });
    console.log("Document written with ID: ", ref.id);
  }
  catch (err) {
    console.error("Something went wrong", err);
  }
}

async function getRecipes() {
  try {
    const querySnapshot = await getDocs(collection(db, 'pizza'));
    const recipes = [];
    querySnapshot.forEach((doc) => {
    recipes.push({ id: doc.id, ...doc.data() });
    });
    return recipes;
  }
  catch (err) {
    console.error("Error getting the recipes: ", err);
    return [];
  }
}

export async function deleteRecipe(id) {
  try {
    await deleteDoc(doc(db, 'pizza', id));
  } catch (err) {
    console.error("Error Occured!", err);
  }
}

// test run 
(async () => {
  // comment‑out after first run if you don’t want duplicates
  await addRecipe();

  const pizzas = await getRecipes();
  console.table(pizzas);   

  process.exit(0);         
})();