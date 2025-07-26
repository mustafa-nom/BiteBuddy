#add stuff here
from dotenv import load_dotenv
import requests
import os

load_dotenv()
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

def get_recipes_from_keywords(food_keywords, num_recipe_per_keyword):
    all_recipes = []
    for keyword in food_keywords:
        params = {
            'query': keyword,
            'number': num_recipe_per_keyword,
            'apiKey': SPOON_API_KEY
        }
        search_url = 'https://api.spoonacular.com/recipes/complexSearch'
        response = requests.get(search_url, params=params)
        data = response.json()

        # take keyword data and get recipe info --> add to all_recipes
        recipes = data.get('results', [])
        for recipe in recipes:
            all_recipes.append({
                'id': recipe['id'],
                'title': recipe['title'],
                'image': recipe.get('image'),
                'source_keyword': keyword
            })

    return all_recipes