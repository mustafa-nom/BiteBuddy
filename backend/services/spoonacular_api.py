#add stuff here
from dotenv import load_dotenv
import requests
import os

load_dotenv()
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

def get_recipes_from_keywords(food_keywords, num_recipe_per_keyword):
    all_recipes = []
    for keyword in food_keywords:
        search_url = 'https://api.spoonacular.com/recipes/complexSearch'
        params = {
            'query': keyword,
            'number': num_recipe_per_keyword,
            'apiKey': SPOON_API_KEY
        }
        response = requests.get(search_url, params=params)
        data = response.json()

        recipes = data.get('results', [])
        for recipe in recipes:
            recipe_id = recipe['id']
            info_url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
            info_params = {
                'apiKey': SPOON_API_KEY
            }
            info_response = requests.get(info_url, params=info_params)
            info_data = info_response.json()

            all_recipes.append({
                'id': recipe_id,
                'title': recipe['title'],
                'image': recipe.get('image'),
                'source_keyword': keyword,
                'cookTime': f"{info_data.get('readyInMinutes', '?')} mins",
                'instructions': info_data.get('instructions', 'No instructions provided.'),
                'neededIngredients': ', '.join([ingredient['name'] for ingredient in info_data.get('extendedIngredients', [])]),
                'type': ', '.join(info_data.get('dishTypes', []))
            })

    return all_recipes

def get_ingredient(ingredient_name):
    params = {
        'query': ingredient_name,
        'apiKey': SPOON_API_KEY
    }
    search_url = 'https://api.spoonacular.com/food/ingredients/search'
    response = requests.get(search_url, params=params)
    data = response.json()
    results = data.get('results', [])
    if not results:
        return None

    ingredient = results[0]
    return {
        'id': ingredient.get('id'),
        'name': ingredient.get('name'),
        'image': ingredient.get('image')
    }
