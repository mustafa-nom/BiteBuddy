from flask import request, Blueprint, jsonify
from config import Config
import requests
import os
from dotenv import load_dotenv
from services.gemini_api import get_recipe_from_mood
from services.spoonacular_api import get_recipes_from_keywords

load_dotenv()

recipes_bp = Blueprint('recipes', __name__)
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

@recipes_bp.route('/suggest', methods=['GET'])
def suggest_recipes_by_mood():
    # get mood from user input
    mood = request.args.get('mood')
    if not mood:
        return jsonify({"error": "no mood given for recipes input"}), 500
    
    # gemini uses mood --> recipes for user to view
    try:
        food_keywords = get_recipe_from_mood(mood)
    except Exception as e:
        return jsonify({"error": f"gemini cant get mood query: {str(e)}"}), 500
    
    try:
        recipe_results = get_recipes_from_keywords(food_keywords, 1)
    except Exception as e:
        return jsonify({"error": f"spoonacular api-call failed: {str(e)}"}), 500
    
    return jsonify({
        "keywords": food_keywords, 
        "recipes": recipe_results,
    })


    # fix to return only recipes that matches Firebase user fridge ingridients
    



# get food recipes based on user's ingridient --> might delete since its not needed manually
@recipes_bp.route('/by-ingredients')
def get_recipes_by_ingredients(): 
    ingredients = request.args.get('ingredients')
    if not ingredients:
        return jsonify({"error": "no ingredients found during input"})
    
    url = 'https://api.spoonacular.com/recipes/findByIngredients'
    params = {
        'ingredients': ingredients,
        'number': 5,
        'apiKey': SPOON_API_KEY
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()
        results = []
        for recipe in data:
            results.append({
                'id': recipe['id'],
                'title': recipe['title'],
                'image': recipe['image'],
                'usedIngredients': [i['name'] for i in recipe['usedIngredients']],
                'missedIngredients': [i['name'] for i in recipe['missedIngredients']]
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": "failed getting recipes from data, " + str(e)}), 500
