import { useState } from 'react';


export default function Fridge() {
    // array to hold ingredients in users fridge
    const [ingredients, setIngredients] = useState([]);
    // manual inputted ingredients
    const [customIngredient, setCustomIngredient] = useState('');
    const [isDoorOpen, setIsDoorOpen] = useState(false);


    const commonIngredients = [
        'Potatoes', 'Eggs', 'Tomatoes', 'Apples', 'Olive Oil', 'Lettuce', 'Cucumbers', 'Bell Peppers', 'Chicken', 'Celery', 'Bread', 'Tofu'
    ]


    // if ingredient isn't already in the fridge, add it to ingredients array
    const handleAddCommonIngredient = (ingredient) => {
        if (!ingredients.includes(ingredient)) {
            setIngredients(ingredients.concat(ingredient))
        }
    };


    // if custom ingredient is not already in ingredients, add it to array
    const handleAddCustomIngredient = (e) => {
        e.preventDefault();
        if (customIngredient.trim() && !ingredients.includes(customIngredient)) {
            setIngredients(ingredients.concat(customIngredient))
            setCustomIngredient(''); // reset
        }
    };


    // filter out specific ingredient from ingredient array
    const handleRemoveIngredient = (ingredientToRemove) => {
        setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
    };


    const toggleDoor = () => {
        setIsDoorOpen(!isDoorOpen);
    };




    return (
        <div className="fridge-container">
            <div className="fridge-header">
                <h1>Ingredients</h1>
                <p>Track what ingredients you have available</p>
            </div>


            <div className="fridge-columns">
                {/* left column - add ingredients*/}
                <div className="fridge-column fridge-add-column">
                    <div className="fridge-section">
                        <h2>Add Common Ingredients</h2>
                        {/* common ingredients */}
                        <div className="fridge-presets">
                            {commonIngredients.map((ingredient, index) => (
                                <button
                                    key={index}
                                    className="fridge-preset-btn"
                                    onClick={() => handleAddCommonIngredient(ingredient)}
                                    disabled={ingredients.includes(ingredient)}
                                >
                                    {ingredient}
                                </button>
                            ))}
                        </div>


                    </div>


                    <div className="fridge-section">
                        <h2> Add Custom Ingredient </h2>
                        {/* form field for users to input custom ingredients */}
                        <form onSubmit={handleAddCustomIngredient} className="fridge-custom-form">
                            <input
                                type="text"
                                value={customIngredient}
                                onChange={(e) => setCustomIngredient(e.target.value)}
                                placeholder="Enter ingredient name"
                                className="fridge-input"
                            />
                            <button type="submit" className="fridge-add-btn">Add</button>
                        </form>
                    </div>
                </div>


                {/* right column - saved ingredients that are in user's fridge */}
                <div className="fridge-column fridge-display-column">
                    <div id="fridge-top" className="fridge-section">
                        <h2> My Fridge </h2>
                        <div id="topline" class="vertical-line"></div>
                    </div>




                    <div className="fridge-body">

                        <div
                            id="fridge-bottom"
                            className={`fridge-section fridge-door ${isDoorOpen ? 'door-open' : ''}`}
                            onClick={toggleDoor}
                        >
                            <div id="bottomline" className="vertical-line"></div>
                        </div>
                        <div className="fridge-interior">
                            <div className="fridge-shelves">
                                {ingredients.length > 0 ? (
                                    <ul className="fridge-items">
                                        {ingredients.map((ingredient, index) => (
                                            <li key={index} className="fridge-item">
                                                {ingredient}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveIngredient(ingredient);
                                                    }}
                                                    className="fridge-remove-btn"
                                                >X</button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Your fridge is empty. Add some ingredients!</p>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>


    );
}


