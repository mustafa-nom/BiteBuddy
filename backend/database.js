
// functions needed from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc} from 'firebase/firestore';
import 'dotenv/config'; 
// import {
//   doc, deleteDoc,
//   updateDoc, deleteField, arrayRemove,
//   writeBatch, 
// } from 'firebase/firestore';


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


export async function addUserLogin(username) {
  try {
    const ref = await setDoc(doc(db, 'users', username), {
      ingredients: [],
      recipes: [],
      dietary_restrictions: [],
    }, {merge:true});
  } catch (err) {
    console.error("Error Occured!", err);
  }
}

export async function getUserData(username) {
  try {
    const user = doc(db, 'users', username);
    const snap = await getDoc(user);
    if (snap.exists()) {
      return snap.data();
    } else {
      console.log("User does not exist!!!!");
      return null;
    }
  }
  catch (err) {
    console.error("Error getting user data: ", err);
    return null;
  }
}


export async function addIngredient(username, ingredient) {
  try {
    const ref = await addDoc(collection(db, 'users', username, 'ingredients'), {
      ...ingredient
    });
    console.log("Ingredient added!");
  }
  catch (err) {
    console.error("Something went wrong", err);
  }
}

export async function addRecipe(username, recipe) {
  try {
    const ref = await addDoc(collection(db, 'users', username, 'recipes'), {
      ...recipe
    });
    console.log("Recipe added!");
  }
  catch (err) {
    console.error("Something went wrong", err);
  }
}

export async function getRecipes(username) {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', username, 'recipes'));
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

export async function get_missing_ingredients(username, ingredients) {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', username, 'ingredients'));
    const userIngredients = querySnapshot.docs.map(doc => doc.data().name.toLowerCase());

    return recipeIngredients.filter(ingredient => 
      !userIngredients.includes(ingredient.name.toLowerCase())
    );
  }
  catch (err) {
    console.error("Error getting missing ingredients :", err);
    return [];
  }
}





// // test run 
// (async () => {
//   // comment‑out after first run if you don’t want duplicates
//   await addRecipe();

//   const pizzas = await getRecipes();
//   console.table(pizzas);   

//   process.exit(0);         
// })();