
// functions needed from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, deleteField} from 'firebase/firestore';
// import 'dotenv/config'; 
// import {
//   doc, deleteDoc,
//   updateDoc, deleteField, arrayRemove,
//   writeBatch, 
// } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);


export async function addUserLogin(username) {
  try {
    const ref = await setDoc(doc(db, 'users', username), {
      fridge_ingredients: [],
      saved_recipes: {},
      dietary_restrictions: [],
      password: '',
      meal_plans: {}, 
    }, {merge:true});
  } catch (err) {
    console.error("Failed to log User!", err);
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

export async function addPassword(username, password) {
  try {
    const ref = doc(db, 'users', username);
    await updateDoc(ref, { password: password });
    console.log("Password added!");
  }
  catch (err) {
    console.error("Something went wrong", err);
  }
}


export async function addIngredient(username, ingredient) {
  try {
    const ref = doc(db, "users", username);
    await updateDoc(ref, { fridge_ingredients: arrayUnion(ingredient) });
  
    console.log("Ingredient added!");
  }
  catch (err) {
    console.error("Failed to add ingredient: ", err);
  }
}

export async function removeIngredient(username, ingredient) {
  try {
    const ref = doc(db, "users", username);
    await updateDoc(ref, { fridge_ingredients: arrayRemove(ingredient) });
  
    console.log("Ingredient removed!");
  }
  catch (err) {
    console.error("Failed to remove ingredient: ", err);
  }
}


export async function addDietaryRestriction(username, dietary_restriction) {
  try {
    const ref = doc(db, "users", username);
    await updateDoc(ref, { dietary_restrictions: arrayUnion(dietary_restriction) });
    console.log("Restriction added!");
  }
  catch (err) {
    console.error("Adding dietary restrction failed", err);
  }
}
export async function removeDietaryRestriction(username, dietary_restriction) {
  try {
    const ref = doc(db, "users", username);
    await updateDoc(ref, { dietary_restrictions: arrayRemove(dietary_restriction) });
    console.log("Restriction removed!");
  }
  catch (err) {  
    console.error("Removing dietary restrction failed", err);
  }
}

// when we save recipe, put everything in this format {title (string), mealType (string), cookTime (int), ingredients (array of strings), instructions (string), imageUrl (string)}
export async function addRecipe(username, recipe) {
  try {
    const ref = doc(db, 'users', username);
    const key = recipe.title.replace(/\s+/g, '_').toLowerCase(); // replace spaces with underscores and convert to lowercase
    await updateDoc(ref, {
      [`saved_recipes.${key}`]: recipe
    });

    console.log("Recipe added!");
  }
  catch (err) {
    console.error("Something went wrong", err);
  } 
}

export async function removeRecipe(username, recipeKey) {
  const ref = doc(db, "users", username);
  try {
    await updateDoc(ref, {
      [`saved_recipes.${recipeKey}`]: deleteField()
    });
    console.log("Recipe removed!");
  }
  catch (err) {
    console.error("Failed to remove recipe: ", err);
  }
} 

export async function getRecipes(username) {
  const data = await getUserData(username);
  const recipesMap = data?.saved_recipes || {};
  return Object.entries(recipesMap).map(([recipeName, recipeDetails]) => ({
    name: recipeName,
    ...recipeDetails
  }));
}

export async function getRecipeById(username, recipeId) {
  try {
    const userData = await getUserData(username);
    const recipesMap = userData?.saved_recipes || {};
    const recipesArray = Object.values(recipesMap);
    // Find recipe by id (as number)
    const matchedRecipe = recipesArray.find(r => r.id === parseInt(recipeId));

    if (!matchedRecipe) {
      console.log("Recipe not found with id:", recipeId);
      return null;
    }

    return matchedRecipe;
  } catch (err) {
    console.error("Error getting recipe:", err);
    return null;
  }
}



export async function getDietaryRestrictions(username) {
  try {
    const user = doc(db, 'users', username);
    const snap = await getDoc(user);
    if (snap.exists()) {
      const dietary = snap.data().dietary_restrictions;
      if (!dietary) {
        console.log("No dietary restrictions found for user.");
        return [];
      }
      else {
        return dietary;
      }
    } 
    else {
      console.log("User does not exist!!!!");
      return null;
    }
  }
  catch (err) {
    console.error("Error getting user data: ", err);
    return null;
  }
}

export async function saveMealPlan(username, planName, mealPlanData) {
  try {
    const ref = doc(db, 'users', username);
    // More robust key generation - remove all invalid Firebase characters
    const key = planName
      .replace(/[~*\/\[\]]/g, '_')  // Replace invalid Firebase characters
      .replace(/\s+/g, '_')         // Replace spaces with underscores
      .replace(/_+/g, '_')          // Replace multiple underscores with single
      .toLowerCase();
    
    console.log("Original plan name:", planName);
    console.log("Generated key:", key);
    
    await updateDoc(ref, {
      [`meal_plans.${key}`]: {
        name: planName,
        createdAt: new Date().toISOString(),
        recipes: mealPlanData
      }
    });
    console.log("Meal plan saved!");
  } catch (err) {
    console.error("Something went wrong", err);
    throw err;
  }
}

export async function getSavedMealPlans(username) {
  try {
    const userData = await getUserData(username);
    return userData?.meal_plans || {};
  } catch (err) {
    console.error("Error getting saved meal plans:", err);
    return {};
  }
}

export async function removeMealPlan(username, day) {
  try {
    const ref = doc(db, 'users', username);
    await updateDoc(ref, { [`meal_plans.${day}`]: deleteField() });
    console.log("Meal plan removed for day:", day);
  }
  catch (err) {
    console.error("Failed to remove meal plan: ", err);
  }
}



// test run 
// (async () => {
//   // comment‑out after first run if you don’t want duplicates
//   await addUserLogin('testuser');
//   await addPassword('testuser', 'password123');
//   await addIngredient('testuser', 'tomato');
//   await addIngredient('testuser', 'cheese');
//   await addDietaryRestrictions('testuser', 'vegetarian');
//   await addRecipe('testuser', 'Margherita Pizza');
 

//   process.exit(0);         
// })();