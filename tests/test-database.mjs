import 'dotenv/config';
import {addUserLogin, addPassword, addIngredient, addDietaryRestriction, addRecipe} from '../frontend/src/database.js';
(async () => {
    const user = 'testuser';
  
  
    await addUserLogin(user);
    console.log('addUserLogin');
  
    await addPassword(user, 'password123');
    console.log('setPassword');
  
    await addIngredient(user, 'tomato');
    await addIngredient(user, 'cheese');
    console.log('addIngredient');
    // await removeIngredient(user, 'tomato');
    // console.log('removeIngredient');
  
    await addDietaryRestriction(user, 'vegetarian');
    console.log('addDietaryRestriction');
    // await removeDietaryRestriction(user, 'vegetarian');
    // console.log('removeDietaryRestriction');
  
    await addRecipe(user, 'Margherita Pizza');
    await addRecipe(user, 'Pasta Carbonara');
    console.log('addRecipe');
    // await deleteRecipe(user, 'margherita_pizza');
    // console.log('deleteRecipe');
  
  
    console.log('All DB helpers passed');
    process.exit(0);
  })();