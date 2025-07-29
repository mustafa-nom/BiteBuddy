import { useState, useEffect } from 'react';
import { getUserData } from '../database.js';
import { useNavigate } from 'react-router-dom';
export default function Dashboard({ username }) {
    // state to check which tab is active. we start by looking at user's saved recipes.
    const [activeTab, setActiveTab] = useState('recipes');
    const navigate = useNavigate();

    // sample data, it will eventually come from API
    // const savedRecipes = [
    //     { id: 1, name: 'Salad', cookTime: '20 mins', category: 'Vegetarian' },
    //     { id: 2, name: 'Chicken Alfredo', cookTime: '30 mins', category: 'Pasta' },
    //     { id: 3, name: 'Pancakes', cookTime: '20 mins', category: 'Breakfast' },
    // ];


    // sample meal plan data to work with recipe details page
    const mealPlan = [
        {
            day: 'Monday',
            meals: [
                { name: 'Oatmeal', id: 3 },
                { name: 'Salad', id: 1 },
                { name: 'Shrimp Fried Rice', id: 4 }
            ]
        },
        {
            day: 'Tuesday',
            meals: [
                { name: 'Smoothie', id: 5 },
                { name: 'Sandwich', id: 6 },
                { name: 'Chicken Alfredo Pasta', id: 2 }
            ]
        },
    ];

    // handle recipe clicks
    const handleRecipeClick = (recipeId) => {
        console.log('Storing username:', username);
        localStorage.setItem('username', username);
        navigate(`/recipe/${recipeId}`);
    };

    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!username) return;
        setLoading(true);
        console.log(username)

        getUserData(username)
            .then(data => {
                console.log("User data loaded:", data);
                const recipesObject = data?.saved_recipes || {};
                const recipesArray = Object.values(recipesObject); // convert object to array
                setSavedRecipes(recipesArray);
                // setSavedRecipes(data?.recipes || []);  Passing in recipes as object causes recipes not to be rendered, recipes should be an array
            })
            .catch(err => console.error("Error loading user data:", err))
            .finally(() => setLoading(false));

    }, [username]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome to BiteBuddy, {username}!</h1>
            </div>

            <div className="dashboard-tabs">

                <button
                    className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recipes')}
                >
                    My Recipes
                </button>

                <button
                    className={`tab-btn ${activeTab === 'mealplan' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mealplan')}
                >
                    Meal Plan
                </button>

            </div>


            <div className="dashboard-content">
                {activeTab === 'recipes' ? (
                    <div className="recipes-list">
                        <h2>Saved Recipes</h2>
                        {/* list out saved recipes */}
                        {loading ? (
                            <p>Loading saved recipes...</p>) :
                            savedRecipes.length > 0 ? (
                                <ul>
                                    {savedRecipes.map(recipe => (
                                        // use recipe id as index for map
                                        <li key={recipe.id} className="recipe-item">
                                            <h3>{recipe.title} </h3>
                                            <p> Time: {recipe.cookTime} </p>
                                            <p> Category: {recipe.category} </p>
                                            <button className="view-btn" onClick={() => handleRecipeClick(recipe.id)}>View Recipe</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No saved recipes yet. Start adding some!</p>
                            )}

                    </div>
                ) : (
                    //link user to recipe for each meal in meal
                    <div className="meal-plan">
                        <h2 id="meal-plan-header" >This Week's Meal Plan</h2>
                        {mealPlan.map(day => (
                            // use day as index for map
                            <div key={day.day} className="day-plan">
                                <h3>{day.day}</h3>
                                <ul>

                                    {day.meals.map((meal, index) => (
                                        <li key={index}>
                                            <span
                                                className="meal-link"
                                                onClick={() => handleRecipeClick(meal.id)}
                                            >
                                                {meal.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}