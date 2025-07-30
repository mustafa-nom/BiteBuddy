from flask import request, Blueprint, jsonify
import requests
import os
import sys
from dotenv import load_dotenv
from services.gemini_api import generate_day_keywords
from services.spoonacular_api import get_recipes_from_keywords

load_dotenv()

meal_plan_bp = Blueprint('meal_plan', __name__)
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

@meal_plan_bp.route('/suggest', methods=['GET'])
def suggest_meal_plan():
    goal = request.args.get('goal')
    if not goal:
        return jsonify({"error": "Missing goal parameter"}), 400

    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    meals = ["Breakfast", "Lunch", "Dinner"]
    meal_plan = {}

    try:
        for day in days:
            # Get 3 meal-specific keywords for this day
            day_keywords = generate_day_keywords(goal, day)  # should return 3 keywords

            # Fetch 3 recipes from Spoonacular using those keywords
            daily_recipes = get_recipes_from_keywords(day_keywords, 1)  # returns list of 3

            # Map recipes to Breakfast, Lunch, Dinner
            meal_plan[day] = {
                meals[i]: daily_recipes[i] if i < len(daily_recipes) else None
                for i in range(3)
            }

    except Exception as e:
        return jsonify({"error": f"Failed to generate meal plan: {str(e)}"}), 500

    return jsonify({"recipes": meal_plan})


    # try:
    #     goal = request.args.get('goal')
    #     print("Goal received:", goal)
    #     if not goal:
    #         return jsonify({"error": "no goal is given in argument"}), 500
        
    #     try:
    #         food_keywords = generate_meal_plan(goal)
    #     except Exception as e:
    #         import traceback
    #         print("Error during meal plan generation:")
    #         traceback.print_exc()
    #         return jsonify({"error": f"gemini cant generate meal plan: {str(e)}"}), 500

    #     try:
    #         recipe_results = get_weekly_recipes_from_keywords(food_keywords, 1)
    #     except Exception as e:
    #         return jsonify({"error": f"spoonacular api-call failed: {str(e)}"}), 500

    #     return jsonify({
    #         "keywords": food_keywords, 
    #         "recipes": recipe_results,
    #     })
    # except Exception as e:
    #     import traceback
    #     traceback.print_exc()  # Prints full traceback in terminal
    #     return jsonify({"error": f"internal server error: {str(e)}"}), 500
