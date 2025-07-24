from flask import request, Blueprint, jsonify
from config import Config
import requests
import os
from dotenv import load_dotenv

load_dotenv()

recipes_bp = Blueprint('recipes', __name__)
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

# get food recipes based on user's ingridient
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
