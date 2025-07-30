import { useState, useEffect } from 'react';
import { getUserData, getSavedMealPlans } from '../database.js';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ username }) {
    // state to check which tab is active. we start by looking at user's saved recipes.
    const [activeTab, setActiveTab] = useState('recipes');
    const navigate = useNavigate();
    const [lidOpen, setLidOpen] = useState(false);

    // handle recipe clicks
    const handleRecipeClick = (recipeId) => {
        console.log('Storing username:', username);
        localStorage.setItem('username', username);
        navigate(`/recipe/${recipeId}`);
    };

    const [savedRecipes, setSavedRecipes] = useState([]);
    const [savedMealPlans, setSavedMealPlans] = useState({});
    const [loading, setLoading] = useState(false);
    const [mealPlanLoading, setMealPlanLoading] = useState(false);

    // Load saved recipes
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
            })
            .catch(err => console.error("Error loading user data:", err))
            .finally(() => setLoading(false));
    }, [username]);

    // Load saved meal plans when meal plan tab is selected
    useEffect(() => {
        if (!username || activeTab !== 'mealplan') return;
        
        setMealPlanLoading(true);
        getSavedMealPlans(username)
            .then(data => {
                console.log("Saved meal plans loaded:", data);
                setSavedMealPlans(data);
            })
            .catch(err => console.error("Error loading meal plans:", err))
            .finally(() => setMealPlanLoading(false));
    }, [username, activeTab]);

    // Get the most recent meal plan (or you could let user select which one to view)
    const getDisplayMealPlan = () => {
        const mealPlanEntries = Object.entries(savedMealPlans);
        if (mealPlanEntries.length === 0) return null;
        
        // Sort by creation date and get the most recent one
        const sortedPlans = mealPlanEntries.sort((a, b) => {
            const dateA = new Date(a[1].createdAt || 0);
            const dateB = new Date(b[1].createdAt || 0);
            return dateB - dateA; // Most recent first
        });
        
        return sortedPlans[0][1]; // Return the plan data
    };

    const displayMealPlan = getDisplayMealPlan();

    return (
        <div className="cooking-pot" style={{ marginTop: activeTab === 'mealplan'? '200px' : '200px' }}>
            <div 
                className={`pot-lid ${lidOpen ? 'open' : ''}`}
                onClick={() => setLidOpen(!lidOpen)} 
            >
                {/* steam only shows when lid is open */}
                {lidOpen && (
                    <>
                        <div className="steam"></div>
                        <div className="steam"></div>
                        <div className="steam"></div>
                    </>
                )}
            </div>

            <div className="pot-lid-handle" onClick={() => setLidOpen(!lidOpen)}></div>

            <div className="dashboard-container pot-body"> 
                <div className="dashboard-header">
                    <div className="cursor typewriter-animation">
                        <h1>Welcome to BiteBuddy, {username}!</h1>
                    </div>  
                </div>

                {!lidOpen && (
                    <h1 className="get-cooking">Let's get cooking! Open the pot lid to get started.</h1>
                )}

                {lidOpen && (
                    <>
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
                                    {loading ? (
                                        <p>Loading saved recipes...</p>
                                    ) : savedRecipes.length > 0 ? (
                                        <ul>
                                            {savedRecipes.map(recipe => (
                                                <li key={recipe.id} className="recipe-item">
                                                    <h3>{recipe.title}</h3>
                                                    <p>Time: {recipe.cookTime}</p>
                                                    <p>Category: {recipe.type}</p>
                                                    <button className="view-btn" onClick={() => handleRecipeClick(recipe.id)}>
                                                        View Recipe
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No saved recipes yet. Start adding some!</p>
                                    )}
                                </div>
                            ) : (
                                <div className="meal-plan">
                                    <h2 id="meal-plan-header">Saved Meal Plan</h2>
                                    {mealPlanLoading ? (
                                        <p>Loading saved meal plans...</p>
                                    ) : displayMealPlan ? (
                                        <>
                                            <div className="meal-plan-info">
                                                <h3>{displayMealPlan.name}</h3>
                                                <p>Created: {new Date(displayMealPlan.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            {Object.entries(displayMealPlan.recipes).map(([day, meals]) => (
                                                <div key={day} className="day-plan">
                                                    <h3>{day}</h3>
                                                    <ul>
                                                        {Object.entries(meals).map(([mealType, meal]) => (
                                                            <li key={`${day}-${mealType}`}>
                                                                <span className="meal-type">{mealType}: </span>
                                                                <span
                                                                    className="meal-link"
                                                                    onClick={() => handleRecipeClick(meal?.id)}
                                                                >
                                                                    {meal?.title || meal?.name || 'No meal planned'}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </>
                                    ) : Object.keys(savedMealPlans).length === 0 ? (
                                        <p>No saved meal plans yet. Create one in the Meal Plan section!</p>
                                    ) : (
                                        <p>No meal plans found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}