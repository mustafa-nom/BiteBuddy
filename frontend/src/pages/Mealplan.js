import { useState } from 'react';
import parse from 'html-react-parser';
import '../App.css';

export default function Mealplan(){

    // This assumes the generated recipes will go breakfast, lunch, and dinner for each day of the week
    const generatedRecipes = {
        Sunday: {
            Breakfast: {
            id: 1,
            name: 'Avocado Toast',
            cookTime: '10 mins',
            instructions: "Step 1: Toast bread. Step 2: Mash avocado and spread on toast. Step 3: Top with salt, pepper, and chili flakes.",
            neededIngredients: "Bread, Avocado, Salt, Pepper, Chili Flakes",
            img: "https://www.spendwithpennies.com/wp-content/uploads/2022/09/Avocado-Toast-SpendWithPennies-1.jpg",
            type: "Breakfast"
            },
            Lunch: {
            id: 2,
            name: 'Turkey Club Sandwich',
            cookTime: '15 mins',
            instructions: "Step 1: Toast bread. Step 2: Layer turkey, bacon, lettuce, tomato, and mayo. Step 3: Slice and serve.",
            neededIngredients: "Bread, Turkey, Bacon, Lettuce, Tomato, Mayo",
            img: "https://www.tasteofhome.com/wp-content/uploads/2025/04/Turkey-Club-Sandwich_EXPS_FT25_278726_EC_0408_5.jpg?w=892",
            type: "Lunch"
            },
            Dinner: {
            id: 3,
            name: 'Grilled Salmon with Asparagus',
            cookTime: '25 mins',
            instructions: "Step 1: Season salmon. Step 2: Grill salmon and asparagus. Step 3: Serve with lemon.",
            neededIngredients: "Salmon, Asparagus, Olive Oil, Lemon, Salt, Pepper",
            img: "https://www.somewhatsimple.com/wp-content/uploads/2020/05/grilled_salmon_asparagus_1.jpg",
            type: "Dinner"
            }
        },
        Monday: {
            Breakfast: {
            id: 4,
            name: 'Greek Yogurt Parfait',
            cookTime: '5 mins',
            instructions: "Step 1: Layer yogurt, granola, and berries in a glass. Step 2: Drizzle with honey.",
            neededIngredients: "Greek Yogurt, Granola, Berries, Honey",
            img: "https://foolproofliving.com/wp-content/uploads/2017/12/Greek-Yogurt-Parfait-Recipe.jpg",
            type: "Breakfast"
            },
            Lunch: {
            id: 5,
            name: 'Chicken Caesar Salad',
            cookTime: '20 mins',
            instructions: "Step 1: Grill chicken. Step 2: Toss lettuce, croutons, parmesan, and dressing. Step 3: Top with sliced chicken.",
            neededIngredients: "Chicken Breast, Romaine Lettuce, Croutons, Parmesan, Caesar Dressing",
            img: "https://s23209.pcdn.co/wp-content/uploads/2023/01/220905_DD_Chx-Caesar-Salad_051.jpg",
            type: "Lunch"
            },
            Dinner: {
            id: 6,
            name: 'Beef Stir Fry',
            cookTime: '30 mins',
            instructions: "Step 1: Sauté beef. Step 2: Add vegetables and stir fry sauce. Step 3: Serve over rice.",
            neededIngredients: "Beef, Mixed Vegetables, Stir Fry Sauce, Rice",
            img: "https://www.cubesnjuliennes.com/wp-content/uploads/2021/01/Chinese-Beef-Stir-Fry-Recipe.jpg",
            type: "Dinner"
            }
        },
        Tuesday: {
            Breakfast: {
            id: 7,
            name: 'Banana Pancakes',
            cookTime: '20 mins',
            instructions: "Step 1: Mix pancake batter with mashed bananas. Step 2: Cook on skillet. Step 3: Serve with syrup.",
            neededIngredients: "Bananas, Pancake Mix, Eggs, Milk, Syrup",
            img: "https://feelgoodfoodie.net/wp-content/uploads/2025/02/Banana-Pancakes-13.jpg",
            type: "Breakfast"
            },
            Lunch: {
            id: 8,
            name: 'Veggie Wrap',
            cookTime: '10 mins',
            instructions: "Step 1: Spread hummus on wrap. Step 2: Add veggies and roll up.",
            neededIngredients: "Tortilla Wrap, Hummus, Cucumber, Bell Pepper, Spinach, Carrot",
            img: "https://tastesbetterfromscratch.com/wp-content/uploads/2014/04/Veggie-Wrap-2.jpg",
            type: "Lunch"
            },
            Dinner: {
            id: 9,
            name: 'Spaghetti Bolognese',
            cookTime: '35 mins',
            instructions: "Step 1: Cook spaghetti. Step 2: Prepare meat sauce. Step 3: Combine and serve.",
            neededIngredients: "Spaghetti, Ground Beef, Tomato Sauce, Onion, Garlic, Parmesan",
            img: "https://www.recipetineats.com/tachyon/2018/07/Spaghetti-Bolognese.jpg",
            type: "Dinner"
            }
        },
        Wednesday: {
            Breakfast: {
            id: 10,
            name: 'Oatmeal with Berries',
            cookTime: '10 mins',
            instructions: "Step 1: Cook oats. Step 2: Top with berries and honey.",
            neededIngredients: "Oats, Milk, Berries, Honey",
            img: "https://media.post.rvohealth.io/wp-content/uploads/2024/06/oatmeal-bowl-blueberries-strawberries-breakfast-732x549-thumbnail.jpg",
            type: "Breakfast"
            },
            Lunch: {
            id: 11,
            name: 'Chicken Quesadilla',
            cookTime: '15 mins',
            instructions: "Step 1: Fill tortilla with chicken and cheese. Step 2: Cook on skillet until golden.",
            neededIngredients: "Tortilla, Chicken, Cheese, Salsa",
            img: "https://takestwoeggs.com/wp-content/uploads/2021/12/Sriracha-mayo-chicken-quesadilla-with-chicken-and-rice-soup-Takestwoeggs-Knorr-Mexican-Sopa-SQ.jpg",
            type: "Lunch"
            },
            Dinner: {
            id: 12,
            name: 'Shrimp Fried Rice',
            cookTime: '25 mins',
            instructions: "Step 1: Sauté shrimp. Step 2: Add rice and veggies. Step 3: Stir fry with soy sauce.",
            neededIngredients: "Shrimp, Rice, Mixed Vegetables, Soy Sauce, Egg",
            img: "https://www.simplyrecipes.com/thmb/n02-MNem3dsm3oJs_e5fl2OE4mo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2008__08__shrimp-fried-rice-vertical-a-1600-8cce5b7f8f8b4ac0aec0b635e41aeeac.jpg",
            type: "Dinner"
            }
        },
        Thursday: {
            Breakfast: {
            id: 13,
            name: 'Spinach Feta Omelette',
            cookTime: '12 mins',
            instructions: "Step 1: Whisk eggs. Step 2: Add spinach and feta. Step 3: Cook in skillet.",
            neededIngredients: "Eggs, Spinach, Feta Cheese, Salt, Pepper",
            img: "https://livesimply.me/wp-content/uploads/2022/05/spinach-feta-omelette-low-carb-recipeDSC09712.jpg",
            type: "Breakfast"
            },
            Lunch: {
            id: 14,
            name: 'BLT Sandwich',
            cookTime: '10 mins',
            instructions: "Step 1: Cook bacon. Step 2: Layer bacon, lettuce, tomato on bread with mayo.",
            neededIngredients: "Bread, Bacon, Lettuce, Tomato, Mayo",
            img: "https://dyvn6jpt1f0d3.cloudfront.net/wp-content/uploads/2023/10/14154227/BLT-for-recipe-1-6-1200x675.jpeg",
            type: "Lunch"
            },
            Dinner: {
            id: 15,
            name: 'Chicken Alfredo',
            cookTime: '30 mins',
            instructions: "Step 1: Cook pasta. Step 2: Make Alfredo sauce. Step 3: Add chicken and combine.",
            neededIngredients: "Pasta, Chicken, Cream, Parmesan, Butter, Garlic",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5EuVYEm22v_-iy2vFQ-4niAT7Dk4uzs_CYA&s",
            type: "Dinner"
            }
        },
        Friday: {
            Breakfast: {
            id: 16,
            name: 'Breakfast Burrito',
            cookTime: '15 mins',
            instructions: "Step 1: Scramble eggs. Step 2: Add cheese and salsa. Step 3: Wrap in tortilla.",
            neededIngredients: "Eggs, Tortilla, Cheese, Salsa",
            img: "https://www.thecandidcooks.com/wp-content/uploads/2021/05/bec-breakfast-burrito-v6.jpg",
            type: "Breakfast"
            },
            Lunch: {
            id: 17,
            name: 'Caprese Salad',
            cookTime: '10 mins',
            instructions: "Step 1: Slice tomatoes and mozzarella. Step 2: Layer with basil. Step 3: Drizzle with olive oil and balsamic.",
            neededIngredients: "Tomato, Mozzarella, Basil, Olive Oil, Balsamic Vinegar",
            img: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2Farchive%2F3b432b41ce04c96a08d77befa42b9881a587a436",
            type: "Lunch"
            },
            Dinner: {
            id: 18,
            name: 'BBQ Chicken Pizza',
            cookTime: '25 mins',
            instructions: "Step 1: Spread BBQ sauce on pizza dough. Step 2: Add chicken, cheese, and onions. Step 3: Bake until golden.",
            neededIngredients: "Pizza Dough, BBQ Sauce, Chicken, Cheese, Onion",
            img: "https://www.tasteandtellblog.com/wp-content/uploads/2021/01/BBQ-Chicken-Pizza-4.jpg",
            type: "Dinner"
            }
        },
        Saturday: {
            Breakfast: {
            id: 19,
            name: 'French Toast',
            cookTime: '15 mins',
            instructions: "Step 1: Dip bread in egg mixture. Step 2: Cook on skillet until golden. Step 3: Serve with syrup.",
            neededIngredients: "Bread, Eggs, Milk, Cinnamon, Syrup",
            img: "https://www.chilitochoc.com/wp-content/uploads/2025/04/buttermilk-french-toast-recipe-500x375.jpg",
            type: "Breakfast"
            },
            Lunch: {
            id: 20,
            name: 'Tuna Salad Sandwich',
            cookTime: '10 mins',
            instructions: "Step 1: Mix tuna with mayo. Step 2: Spread on bread with lettuce.",
            neededIngredients: "Tuna, Mayo, Bread, Lettuce",
            img: "https://cravinghomecooked.com/wp-content/uploads/2023/11/tuna-salad-sandwich-1-16.jpg",
            type: "Lunch"
            },
            Dinner: {
            id: 21,
            name: 'Vegetable Curry',
            cookTime: '35 mins',
            instructions: "Step 1: Sauté vegetables. Step 2: Add curry sauce and simmer. Step 3: Serve with rice.",
            neededIngredients: "Mixed Vegetables, Curry Sauce, Rice",
            img: "https://shwetainthekitchen.com/wp-content/uploads/2023/03/mixed-vegetable-curry.jpg",
            type: "Dinner"
            }
        }
    };

    const [showSavePlan, setShowSavePlan] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [recipes, setRecipes] = useState({});

    // This will save the plan to view on the dashboard
    const SavePlan = () => {

    };

    // This will save the recipe to the database
    const SaveRecipe = () => {

    };

    // This will shuffle the recipe for a new one
    const ShuffleRecipe = () => {

    };

    // Scroll to the day you want
    const scrollTo = (day) => {
        const section = document.getElementById(day);
        if (section) {
            section.scrollIntoView({behavior: 'smooth'});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!textInput) {
            alert('Please enter your goals for the week.');
            return
        }
        setShowSavePlan(!showSavePlan)

        try {
            const res = await fetch(`http://localhost:5000/meal_plan/suggest?goal=${encodeURIComponent(textInput)}`);
            const data = await res.json();
            
            if (data.recipes) {
                setRecipes(data.recipes);
                console.log('data.recipes:', data.recipes);
            } else {
                alert("No recipes found.");
                setRecipes({});
            }
            setTextInput('');
        } catch (e) {
            console.log('failed to fetch recipes', e)
            alert('Failed getting recipes. Try again.')
        }
    };

    return(
        // Everything will be inside this container
        <div className = "mealplan-container">
            
            {/* Title of the page */}
            <div className = "input-box">
                <h1 id="page-header">Meal Plan</h1>
                <p id="recipe-instruct"> 🍎 Generate a 7-day meal plan based on your goals 🍎 </p>
            </div>


            {/* The input box for the user */}
            <div className = "input-box">
                <form onSubmit={handleSubmit}>
                    <input
                    type="text"
                    placeholder="What are your diet goals for the week? 🍕🥞🍖🍣"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    />
                    <button type = "submit">🥄</button>
                </form>
            </div>

            {/* Button to generate meals DONT NEED TO GENERATE MEALS ANYMORE SINCE WE ARE USING A TEXTBOX*/}
            {/* <div className = "center-btn" id = "top">
                <button className = "view-btn" onClick={GenerateMeals}>Generate Meals 🍽</button>
            </div> */}

            {Object.keys(recipes).length == 0 && !showSavePlan && (
                <p id="empty-text">Generate a meal plan!</p>
            )}

            {Object.keys(recipes).length > 0 && showSavePlan && (
            <div className = "center-btn">
                <button className = "view-btn" onClick={SavePlan}>Save Plan</button>

                <h2 id="empty-text">Go To</h2>
                <div className="button-list">
                    <button className ="view-btn" onClick={() => scrollTo("Sunday")}>Sunday</button>
                    <button className ="view-btn" onClick={() => scrollTo("Monday")}>Monday</button>
                    <button className ="view-btn" onClick={() => scrollTo("Tuesday")}>Tuesday</button>
                    <button className ="view-btn" onClick={() => scrollTo("Wednesday")}>Wednesday</button>
                    <button className ="view-btn" onClick={() => scrollTo("Thursday")}>Thursday</button>
                    <button className ="view-btn" onClick={() => scrollTo("Friday")}>Friday</button>
                    <button className ="view-btn" onClick={() => scrollTo("Saturday")}>Saturday</button>
                </div>
            </div>
            )}

       
            
            

            {/* Contains ALL THE GENERATED MEALS */}

            
            <div>
                {showSavePlan && Object.keys(recipes).length > 0 && (
                Object.entries(recipes).map(([day, meals]) => (
                    <>
                        <div className = "day-header" id = {day}>
                            <h2>{day}</h2>
                        </div>

                        <div className = "day-container" key={day}>
                            {Object.entries(meals).map(([mealType, recipe]) => (
                                <div className = "mealplan-recipes">
                                    <div className = "recipe-card" key={recipe.id}>
                                        <h3 className = "text-2xl font-bold">{mealType}</h3>
                                        <img src = {recipe.image}></img>
                                        <h3 className = "text-2xl font-semibold">{recipe.name}</h3>
                                        <h4>Food Type: {recipe.type}</h4>
                                        <h4>Time: ~{recipe.cookTime}</h4>
                                        <h4>Ingredients: {recipe.neededIngredients}</h4>
                                        <p>{parseFloat(recipe.instructions)}</p>
                                        <div className = "button-list">
                                            {/* TODO add a basic functionality to the buttons */}
                                            <button className = "view-btn" onClick={SaveRecipe}>Save Recipe</button>
                                            {/* <button className = "view-btn" onClick={ShuffleRecipe}>Shuffle Recipe</button> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className = "center-btn">
                            <button className="view-btn" onClick={() => scrollTo("page-header")}>Go To Top</button>
                        </div>
                    </>
                ))
                )}
            </div>
        </div>
    );
}