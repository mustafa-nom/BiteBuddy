import requests
import os
from config import Config
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify, render_template
from pathlib import Path

dotenv_path = Path(__file__).resolve().parents[1] / 'services' / '.env'
load_dotenv(dotenv_path)

map_bp = Blueprint('map', __name__)
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')
GEOAPIFY_API_KEY = os.getenv('GEOAPIFY_API_KEY')

@map_bp.route('/recipe')
def get_recipe():
    url = 'https://api.spoonacular.com/recipes/findByIngredients'

    ingredients = ['potato', 'chicken', 'eggs', 'bread', 'rigatoni', 'tomatoes']

    params = {
        'ingredients': ','.join(ingredients),  # <-- comma-separated string
        'number': 1,
        'apiKey': SPOON_API_KEY
    }

    response = requests.get(url, params=params)
    
    # Just return the JSON result directly
    return jsonify(response.json())

def get_missing_ingredients(recipe):
    missed_ingredients = []
    for missed in recipe["missedIngredients"]:
        missed_ingredients.append(missed["orignalName"])
    return missed_ingredients

def get_coordinates_from_zip(zip_code):
    url = f"https://api.geoapify.com/v1/geocode/search"
    params = {
        'text': zip_code,
        'apiKey': GEOAPIFY_API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    if data['features']:
        location = data['features'][0]['geometry']['coordinates']
        lng, lat = location  # Geoapify returns (lng, lat)
        print(f"lng:{lng}, lat:{lat}")
        return lat, lng
    else:
        raise Exception("ZIP code not found or invalid.")
    
def find_grocery_stores(lat, lng, radius=5000):
    url = f"https://api.geoapify.com/v2/places"
    params = {
        'categories': 'commercial.supermarket',
        'filter': f'circle:{lng},{lat},{radius}',
        'limit': 10,
        'apiKey': GEOAPIFY_API_KEY
    }
    response = requests.get(url, params=params)
    return response.json()

def find_grocery_stores_by_zip(zip_code, radius=5000):
    lat, lng = get_coordinates_from_zip(zip_code)
    return find_grocery_stores(lat, lng, radius)

@map_bp.route('/find-stores', methods=['GET'])
def find_stores_by_zip():
    zip_code = request.args.get('zip')

    if not zip_code:
        return jsonify({'error': 'ZIP code required'}), 400

    try:
        stores = find_grocery_stores_by_zip(zip_code)
        return jsonify(stores)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@map_bp.route('/store_map')
def store_map():
    return render_template('map.html', geoapify_key=GEOAPIFY_API_KEY)  # map.html contains the Leaflet code

