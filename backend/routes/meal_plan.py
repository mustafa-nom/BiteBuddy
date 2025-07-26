from flask import request, Blueprint, jsonify
from config import Config
import requests
import os
from dotenv import load_dotenv
from services.gemini_api import generate_meal_plan
from services.spoonacular_api import get_recipes_from_keywords

load_dotenv()

meal_plan_bp = Blueprint('meal_plan', __name__)
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

@meal_plan_bp.route('/suggest', methods=['GET'])
def suggest_meal_plan():
    goal = request.args.get('goal')
    if not goal:
        return jsonify({"error": "no goal is given in argument"}), 500
    
    try:
        food_keywords = generate_meal_plan(goal)
    except Exception as e:
        return jsonify({"error": f"gemini cant generate meal plan: {str(e)}"}), 500

    try:
        recipe_results = get_recipes_from_keywords(food_keywords, 1)
    except Exception as e:
        return jsonify({"error": f"spoonacular api-call failed: {str(e)}"}), 500

    return jsonify({
        "keywords": food_keywords, 
        "recipes": recipe_results,
    })