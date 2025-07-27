from flask import request, Blueprint, jsonify
from config import Config
import requests
import os
from dotenv import load_dotenv
from services.spoonacular_api import get_ingredient

load_dotenv()

fridge_bp = Blueprint('fridge_bp', __name__)
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

@fridge_bp.route('/search')
def match_user_ingredient_with_spoonacular():
    ing = request.args.get('ingredient')
    if not ing:
        return jsonify({"error": "no ingredient is given in argument"}), 500
    
    ingredient = get_ingredient(ing)
    if not ingredient:
        return jsonify({"error": "no ingredient found"}), 404
        
    return jsonify(ingredient)
    